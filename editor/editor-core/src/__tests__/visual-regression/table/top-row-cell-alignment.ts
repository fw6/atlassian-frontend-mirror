import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/table-with-top-row-content.adf.json';
import {
  clickFirstCell,
  getSelectorForTableCell,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import { tableSelectors } from '@atlaskit/editor-test-helpers/page-objects/table';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
  toolbarMenuItemsSelectors as selectors,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';

let page: PuppeteerPage;
const initEditor = async (adf: Object) => {
  await initEditorWithAdf(page, {
    appearance: Appearance.fullPage,
    adf,
    viewport: { width: 1040, height: 500 },
    editorProps: {
      allowTables: {
        allowHeaderRow: true,
        allowBackgroundColor: true,
        advanced: true,
      },
    },
  });
};

describe('Snapshot Test: table top row cell alignment', () => {
  beforeAll(async () => {
    page = global.page;
    await initEditor(adf);
  });

  beforeEach(async () => {
    await clickFirstCell(page, true);
    const topRowCell = getSelectorForTableCell({
      row: 1,
      cell: 1,
    });

    await page.click(topRowCell);

    await clickToolbarMenu(page, ToolbarMenuItem.alignment);
    await page.waitForSelector(selectors[ToolbarMenuItem.toolbarDropList]);
  });

  afterEach(async () => {
    await animationFrame(page);
    await animationFrame(page);
    await snapshot(page, {}, tableSelectors.tableWrapper);
  });

  it('should be able to apply left alignment to top row cell', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.alignmentLeft);
  });

  it('should be able to apply center alignment to top row cell', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.alignmentCenter);
  });

  it('should be able to apply right alignment to top row cell', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.alignmentRight);
  });
});
