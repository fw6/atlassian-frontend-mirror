import {
  PuppeteerPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '../../../../__tests__/visual-regression/_utils';
import { waitForMediaToBeLoaded } from '@atlaskit/editor-test-helpers/page-objects/media';
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';

const getMediaWithLink = (link: string) => ({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'mediaSingle',
      attrs: {
        layout: 'center',
      },
      content: [
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            collection: 'MediaServicesSample',
            width: 500,
            height: 375,
          },
          marks: [
            {
              type: 'link',
              attrs: {
                href: link,
              },
            },
          ],
        },
      ],
    },
  ],
});

const linkButtonSelector = '.hyperlink-open-link';
const mediaCardSelector = '[data-testid="media-file-card-view"]';

async function initEditor(page: PuppeteerPage, mediaLink: string) {
  await initFullPageEditorWithAdf(
    page,
    getMediaWithLink(mediaLink),
    Device.LaptopMDPI,
    undefined,
    {
      media: {
        allowMediaSingle: true,
        allowLinking: true,
      },
    },
  );

  await waitForMediaToBeLoaded(page);

  // force the toolbar to appear first, because it doesn't automatically appear if the ADF that
  // gets loaded in doesn't pass validation
  await page.click(mediaCardSelector);
  await page.click('[aria-label="Action item"]');
  await page.waitForSelector(selectors.actionList);
  await page.keyboard.press('Backspace');

  await retryUntilStablePosition(
    page,
    async () => await page.click(mediaCardSelector),
    '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"] [aria-label="Remove"]',
    2000,
  );
}

describe('Snapshot Test: Media with link', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  describe('in the toolbar', () => {
    describe('when media-link feature flag is enabled', () => {
      afterEach(async () => {
        await snapshot(page);
      });

      it('should enable open link button if the link is safe', async () => {
        await initEditor(page, 'https://www.atlassian.com');
        await retryUntilStablePosition(
          page,
          async () => await page.hover(linkButtonSelector),
          '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"] [aria-label="Remove"]',
          2000,
        );
        await waitForTooltip(page, 'Open link in a new tab');
      });

      it('should disable open link button if the link is unsafe', async () => {
        await initEditor(page, `javascript:alert('hacks')`);
      });
    });
  });
});
