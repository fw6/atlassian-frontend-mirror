import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
} from '@testing-library/react';
import {
  BlockCardResolvingView,
  BlockCardUnauthorisedView,
  BlockCardForbiddenView,
  BlockCardErroredView,
  BlockCardResolvedView,
} from '../../../BlockCard';
import {
  CelebrationImage,
  LockImage,
} from '../../../BlockCard/utils/constants';
import { ResolvedViewProps } from '../../../BlockCard/views/ResolvedView';

const getResolvedProps = (overrides = {}): ResolvedViewProps => ({
  link: 'https://github.com/changesets/changesets',
  icon: { icon: 'https://github.com/atlassian/changesets' },
  title: 'House of Holbein',
  users: [],
  actions: [],
  handleAvatarClick: () => {},
  ...overrides,
});

describe('BlockCard Views', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('view: resolved', () => {
    it('renders view', () => {
      const { getByTestId } = render(
        <BlockCardResolvedView
          testId="resolved-view"
          {...getResolvedProps()}
        />,
      );
      const frame = getByTestId('resolved-view');
      expect(frame.textContent).toBe(
        'https://github.com/atlassian/changesetsHouse of Holbein',
      );
    });

    it('renders should show metadata', () => {
      const { getByTestId } = render(
        <BlockCardResolvedView
          testId="resolved-view"
          {...getResolvedProps({
            details: [{ text: 'fill my goblet up to the brim' }],
          })}
        />,
      );
      const frame = getByTestId('resolved-view-meta');
      expect(frame.textContent).toBe('fill my goblet up to the brim');
    });

    it('renders should show byline', () => {
      const { getByTestId } = render(
        <BlockCardResolvedView
          testId="resolved-view"
          {...getResolvedProps({ byline: 'V real react node' })}
        />,
      );
      const frame = getByTestId('resolved-view-by');
      expect(frame.textContent).toBe('V real react node');
    });

    it('renders should show description', () => {
      const { getByTestId } = render(
        <BlockCardResolvedView
          testId="resolved-view"
          {...getResolvedProps({
            description: 'Tall, large, Henry the eighth',
          })}
        />,
      );
      const frame = getByTestId('resolved-view-by');
      expect(frame.textContent).toBe('Tall, large, Henry the eighth');
    });

    it('renders should show byline if both byline and description are passed', () => {
      const { getByTestId } = render(
        <BlockCardResolvedView
          testId="resolved-view"
          {...getResolvedProps({
            byline: 'V real react node',
            description: 'Tall, large, Henry the eighth',
          })}
        />,
      );
      const frame = getByTestId('resolved-view-by');
      expect(frame.textContent).toBe('V real react node');
    });

    it('renders should show the metadata if both metadata and byline are passed', () => {
      const { getByTestId } = render(
        <BlockCardResolvedView
          testId="resolved-view"
          {...getResolvedProps({
            byline: 'V real react node',
            details: [{ text: 'fill my goblet up to the brim' }],
          })}
        />,
      );
      const frame = getByTestId('resolved-view-meta');
      expect(frame.textContent).toBe('fill my goblet up to the brim');
    });

    it('renders a passed image as a background', () => {
      const { getByTestId } = render(
        <BlockCardResolvedView
          testId="resolved-view"
          {...getResolvedProps({ thumbnail: 'Our riffs were on fire' })}
        />,
      );
      const thumb = getByTestId('resolved-view-thumb');
      expect(thumb).toHaveStyleDeclaration(
        'background-image',
        `url(Our riffs were on fire)`,
      );
    });
  });

  describe('view: resolving', () => {
    it('renders view', () => {
      const { getByTestId } = render(
        <BlockCardResolvingView testId="resolving-view" />,
      );
      const frame = getByTestId('resolving-view');
      expect(frame.textContent).toBe('Loading...');
    });
  });

  describe('view: unauthorised', () => {
    it('renders view', () => {
      const { getByTestId } = render(
        <BlockCardUnauthorisedView
          context={{ text: 'cool theatre stuff' }}
          testId="unauthorised-view"
          actions={[]}
        />,
      );
      const nameFrame = getByTestId('unauthorised-view-name');
      expect(nameFrame.textContent).toBe('Get more out of your links');
      const byline = getByTestId('unauthorised-view-byline');
      expect(byline.textContent).toBe(
        `Make these link previews more breathtaking by connecting cool theatre stuff to your Atlassian products.`,
      );

      const thumb = getByTestId('unauthorised-view-thumb');

      // @ts-ignore
      expect(thumb.firstChild.src).toEqual(CelebrationImage);
    });

    it('renders view with actions', () => {
      const { getByText } = render(
        <BlockCardUnauthorisedView
          context={{ text: 'not allowed to view' }}
          testId="unauthorised-view"
          actions={[
            {
              id: 'test-button',
              text: 'One of a kind',
              promise: () => Promise.resolve('historemix'),
            },
          ]}
        />,
      );
      expect(getByText('One of a kind')).toBeInTheDocument();
    });

    it('renders view with actions - reacts to click on action', async () => {
      const { getByTestId } = render(
        <BlockCardUnauthorisedView
          context={{ text: 'not allowed to view' }}
          testId="unauthorised-view"
          actions={[
            {
              id: 'test-button',
              text: 'One of a kind',
              promise: () => Promise.resolve('historemix'),
            },
          ]}
        />,
      );
      // Check button is there
      const button = getByTestId('button-test-button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe('One of a kind');

      // Click button, expecting it to succeed.
      fireEvent.click(button);
      const checkIcon = await waitForElement(() => getByTestId('check-icon'));
      expect(checkIcon).toBeInTheDocument();
    });
  });

  describe('view: forbidden', () => {
    it('renders view', () => {
      const { getByTestId } = render(
        <BlockCardForbiddenView testId="forbidden-view" />,
      );
      const frame = getByTestId('forbidden-view');
      expect(frame.textContent).toBe("You don't have access to this link");

      const thumb = getByTestId('forbidden-view-thumb');

      // @ts-ignore
      expect(thumb.firstChild.src).toEqual(LockImage);
    });
  });

  describe('view: errored', () => {
    it('renders view', () => {
      const { getByTestId } = render(
        <BlockCardErroredView testId="errored-view" />,
      );
      const frame = getByTestId('errored-view');
      expect(frame.textContent).toBe(
        "We couldn't load this link for some reason.Try Again",
      );
    });

    it('renders view - clicking on retry enacts callback', () => {
      const onRetryMock = jest.fn();
      const { getByTestId } = render(
        <BlockCardErroredView testId="errored-view" onRetry={onRetryMock} />,
      );
      const frame = getByTestId('errored-view');
      expect(frame.textContent).toBe(
        "We couldn't load this link for some reason.Try Again",
      );

      // Check the button is there
      const button = getByTestId('err-view-retry');
      expect(button.textContent).toBe('Try Again');

      // Click it, check mock is called
      fireEvent.click(button);
      expect(onRetryMock).toHaveBeenCalled();
      expect(onRetryMock).toHaveBeenCalledTimes(1);
    });
  });
});
