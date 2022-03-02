import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, waitForElement } from '@testing-library/react';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { SmartLinkStatus } from '../../../../../../constants';
import PreviewBlock from '../index';
import { PreviewBlockProps } from '../types';

describe('PreviewBlock', () => {
  const testId = 'test-smart-block-preview';

  const renderPreviewBlock = (props?: PreviewBlockProps) =>
    render(
      <IntlProvider locale="en">
        <FlexibleUiContext.Provider value={context}>
          <PreviewBlock status={SmartLinkStatus.Resolved} {...props} />
        </FlexibleUiContext.Provider>
      </IntlProvider>,
    );

  it('renders PreviewBlock', async () => {
    const { getByTestId } = renderPreviewBlock({
      testId,
    });

    const block = await waitForElement(() =>
      getByTestId(`${testId}-resolved-view`),
    );

    expect(block).toBeDefined();
  });

  describe('with specific status', () => {
    it('renders PreviewBlock when status is resolved', async () => {
      const { getByTestId } = renderPreviewBlock();

      const block = await waitForElement(() =>
        getByTestId('smart-block-preview-resolved-view'),
      );

      expect(block).toBeDefined();
    });

    it.each([
      [SmartLinkStatus.Resolving],
      [SmartLinkStatus.Forbidden],
      [SmartLinkStatus.Errored],
      [SmartLinkStatus.NotFound],
      [SmartLinkStatus.Unauthorized],
      [SmartLinkStatus.Fallback],
    ])(
      'does not renders PreviewBlock when status is %s',
      async (status: SmartLinkStatus) => {
        const { container } = renderPreviewBlock({
          status,
        });
        expect(container.children.length).toEqual(0);
      },
    );
  });
});