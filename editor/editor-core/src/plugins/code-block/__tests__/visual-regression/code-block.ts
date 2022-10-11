import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '../../../../__tests__/visual-regression/_utils';
import { getBoundingClientRect } from '@atlaskit/editor-test-helpers/vr-utils/bounding-client-rect';
import { codeBlockSelectors } from '@atlaskit/editor-test-helpers/page-objects/code-block';
import { codeBlocks } from '../__fixtures__/code-blocks';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { tableHeaderCode } from '../__fixtures__/table-code-header';

describe('Code block:', () => {
  let page: PuppeteerPage;

  beforeAll(() => {
    page = global.page;
  });

  it('looks correct', async () => {
    await initEditorWithAdf(page, {
      adf: codeBlocks,
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 500 },
    });

    await page.waitForSelector(codeBlockSelectors.code);
    await page.click(codeBlockSelectors.code);
    await snapshot(page, undefined, codeBlockSelectors.codeBlock);
  });

  it('displays as selected when click on line numbers', async () => {
    await initEditorWithAdf(page, {
      adf: codeBlocks,
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 500 },
    });

    await page.click(codeBlockSelectors.lineNumbers);
    await snapshot(page, undefined, codeBlockSelectors.codeBlock);
  });

  it('displays as selected when click on padding', async () => {
    await initEditorWithAdf(page, {
      adf: codeBlocks,
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 500 },
    });

    const contentBoundingRect = await getBoundingClientRect(
      page,
      codeBlockSelectors.content,
    );
    await page.mouse.click(contentBoundingRect.left, contentBoundingRect.top);
    await snapshot(page, undefined, codeBlockSelectors.codeBlock);
  });

  it('displays without overflow shadow in table headers if not overflowing', async () => {
    await initEditorWithAdf(page, {
      adf: tableHeaderCode,
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 500 },
    });

    await snapshot(page, undefined, codeBlockSelectors.codeBlock);
  });
});
