import {
  PuppeteerPage,
  waitForNoTooltip,
} from '@atlaskit/visual-regression/helper';
import { insertTable } from '@atlaskit/editor-test-helpers/page-objects/table';

import {
  snapshot,
  initFullPageEditorWithAdf,
} from '../../../../__tests__/visual-regression/_utils';

const firstCellSelector = 'table tbody th p';
const cellOptionsSelector = '[aria-label="Cell options"]';
const deleteColumnCellOptionSelector = '[aria-label="Delete column"]';
const deleteRowCellOptionSelector = '[aria-label="Delete row"]';

const emptyDocAdf = {
  version: 1,
  type: 'doc',
  content: [],
};

describe('Table cell options menu', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(page, emptyDocAdf);
    await insertTable(page);
    page.waitForSelector(firstCellSelector);

    // move the focus to the first table cell
    await page.type(firstCellSelector, 'focus table cell');
  });

  describe('delete column menu item', () => {
    it('visual hints should be added to the table column on hover', async () => {
      // open the table cell options menu
      await page.waitForSelector(cellOptionsSelector);
      await page.click(cellOptionsSelector);

      // hover over the table cell options Delete column entry
      await page.waitForSelector(deleteColumnCellOptionSelector);
      await page.hover(deleteColumnCellOptionSelector);

      await waitForNoTooltip(page);

      await snapshot(page);
    });

    it('should remove the table column on click', async () => {
      // open the table cell options menu
      await page.waitForSelector(cellOptionsSelector);
      await page.click(cellOptionsSelector);

      // click the table cell options Delete column entry
      await page.waitForSelector(deleteColumnCellOptionSelector);
      await page.click(deleteColumnCellOptionSelector);

      await waitForNoTooltip(page);

      await snapshot(page);
    });
  });

  describe('delete row menu item', () => {
    it('visual hints should be added to the table row on hover', async () => {
      // open the table cell options menu
      await page.waitForSelector(cellOptionsSelector);
      await page.click(cellOptionsSelector);

      // hover over the table cell options Delete row entry
      await page.waitForSelector(deleteRowCellOptionSelector);
      await page.hover(deleteRowCellOptionSelector);

      await waitForNoTooltip(page);

      await snapshot(page);
    });

    it('should remove the table row on click', async () => {
      // open the table cell options menu
      await page.waitForSelector(cellOptionsSelector);
      await page.click(cellOptionsSelector);

      // click the table cell options Delete row entry
      await page.waitForSelector(deleteColumnCellOptionSelector);
      await page.click(deleteRowCellOptionSelector);

      await waitForNoTooltip(page);

      await snapshot(page);
    });
  });
});
