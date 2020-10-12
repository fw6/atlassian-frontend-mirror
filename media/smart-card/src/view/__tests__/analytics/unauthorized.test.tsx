import { mockEvents } from '../../__mocks__/events';
import { AuthError } from '@atlaskit/outbound-auth-flow-client';
const mockAuthFlow = jest.fn();

jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.doMock('../../../utils/analytics', () => mockEvents);
jest.doMock('@atlaskit/outbound-auth-flow-client', () => ({
  auth: mockAuthFlow,
  AuthError,
}));
const mockAPIError = jest.fn();
jest.doMock('../../../client/errors', () => ({
  APIError: mockAPIError,
}));
import CardClient from '../../../client';
import React from 'react';
import { Card } from '../../Card';
import { Provider } from '../../..';
import { fakeFactory, mocks } from '../../../utils/mocks';
import {
  render,
  waitForElement,
  fireEvent,
  cleanup,
} from '@testing-library/react';

describe('smart-card: unauthorized analytics', () => {
  let mockClient: CardClient;
  let mockFetch: jest.Mock;
  let mockWindowOpen: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn(async () => mocks.success);
    mockClient = new (fakeFactory(mockFetch))();
    mockWindowOpen = jest.fn();
    /// @ts-ignore
    global.open = mockWindowOpen;
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('unauthorized', () => {
    it('should fire connectSucceeded event when auth succeeds', async () => {
      const mockUrl = 'https://https://this.is.a.url';
      mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
      const { getByTestId, container } = render(
        <Provider client={mockClient}>
          <Card testId="unauthorizedCard1" appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const unauthorizedLink = await waitForElement(
        () => getByTestId('unauthorizedCard1-unauthorized-view'),
        { timeout: 10000 },
      );
      const unauthorizedLinkButton = container.querySelector('[type="button"]');
      expect(unauthorizedLink).toBeTruthy();
      expect(unauthorizedLinkButton).toBeTruthy();
      expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
      // Mock out auth flow, & click connect.
      mockAuthFlow.mockImplementationOnce(async () => ({}));
      fireEvent.click(unauthorizedLinkButton!);

      mockFetch.mockImplementationOnce(async () => mocks.success);
      const resolvedView = await waitForElement(() =>
        getByTestId('unauthorizedCard1-resolved-view'),
      );
      expect(resolvedView).toBeTruthy();
      expect(mockEvents.unresolvedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.uiAuthEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.trackAppAccountConnected).toHaveBeenCalledTimes(1);
      expect(mockEvents.connectSucceededEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.fireSmartLinkEvent).toBeCalledWith(
        {
          action: 'unresolved',
          attributes: {
            componentName: 'smart-cards',
            display: 'inline',
          },
        },
        expect.any(Function),
      );
    });

    it.each`
      errorType
      ${undefined}
      ${'access_denied'}
    `(
      'should fire connectFailed event when auth fails with errorType = $errorType',
      async errorType => {
        const mockUrl = 'https://https://this.is.the.second.url';
        mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
        const { getByTestId, container } = render(
          <Provider client={mockClient}>
            <Card
              testId="unauthorizedCard2"
              appearance="inline"
              url={mockUrl}
            />
          </Provider>,
        );
        const unauthorizedLink = await waitForElement(
          () => getByTestId('unauthorizedCard2-unauthorized-view'),
          { timeout: 10000 },
        );
        const unauthorizedLinkButton = container.querySelector(
          '[type="button"]',
        );
        expect(unauthorizedLink).toBeTruthy();
        expect(unauthorizedLinkButton).toBeTruthy();
        expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
        // Mock out auth flow, & click connect.
        mockAuthFlow.mockImplementationOnce(() =>
          Promise.reject(new AuthError('', errorType)),
        );
        fireEvent.click(unauthorizedLinkButton!);

        const unresolvedView = await waitForElement(
          () => getByTestId('unauthorizedCard2-unauthorized-view'),
          {
            timeout: 10000,
          },
        );
        expect(unresolvedView).toBeTruthy();
        expect(mockEvents.unresolvedEvent).toHaveBeenCalledTimes(1);
        expect(mockEvents.uiAuthEvent).toHaveBeenCalledTimes(1);
        expect(mockEvents.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
        expect(mockEvents.connectFailedEvent).toHaveBeenCalledTimes(1);
        expect(mockEvents.connectFailedEvent).toHaveBeenCalledWith(
          'd1',
          'object-provider',
          errorType,
        );
      },
    );

    it('should fire connectFailed when auth dialog was closed', async () => {
      const mockUrl = 'https://https://this.is.the.third.url';
      mockFetch.mockImplementationOnce(async () => mocks.unauthorized);
      const { getByTestId, container } = render(
        <Provider client={mockClient}>
          <Card testId="unauthorizedCard3" appearance="inline" url={mockUrl} />
        </Provider>,
      );
      const unauthorizedLink = await waitForElement(
        () => getByTestId('unauthorizedCard3-unauthorized-view'),
        { timeout: 10000 },
      );
      const unauthorizedLinkButton = container.querySelector('[type="button"]');
      expect(unauthorizedLink).toBeTruthy();
      expect(unauthorizedLinkButton).toBeTruthy();
      expect(unauthorizedLinkButton!.innerHTML).toContain('Connect');
      // Mock out auth flow, & click connect.
      mockAuthFlow.mockImplementationOnce(() =>
        Promise.reject(new AuthError('', 'auth_window_closed')),
      );
      fireEvent.click(unauthorizedLinkButton!);

      const resolvedView = await waitForElement(
        () => getByTestId('unauthorizedCard3-resolved-view'),
        {
          timeout: 10000,
        },
      );
      expect(resolvedView).toBeTruthy();
      expect(mockEvents.unresolvedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.uiAuthEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.screenAuthPopupEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.uiClosedAuthEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.connectFailedEvent).toHaveBeenCalledTimes(1);
      expect(mockEvents.connectFailedEvent).toHaveBeenCalledWith(
        'd1',
        'object-provider',
        'auth_window_closed',
      );
    });
  });
});