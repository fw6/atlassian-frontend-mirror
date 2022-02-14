import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  ExampleCreateInlineCommentComponent,
  ExampleViewInlineCommentComponent,
} from '@atlaskit/editor-test-helpers/example-inline-comment-component';
import {
  evaluateCoordinates,
  scrollToBottom,
  scrollToElement,
  selectAtPosWithProseMirror,
} from '../../../../__tests__/__helpers/page-objects/_editor';
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '../../../../__tests__/visual-regression/_utils';
import adf from '../__fixtures__/toolbar-position.adf.json';
import adfWithTable from '../__fixtures__/toolbar-position-table.adf.json';
import { annotationSelectors, getState } from '../_utils';
import {
  clickFirstCell,
  selectColumn,
  selectRow,
  tableSelectors,
} from '../../../../__tests__/__helpers/page-objects/_table';
import { retryUntilStablePosition } from '../../../../__tests__/__helpers/page-objects/_toolbar';

const init = async (page: PuppeteerPage, adf: Object) => {
  return await initFullPageEditorWithAdf(
    page,
    adf,
    undefined,
    { width: 1366, height: 768 },
    {
      annotationProviders: {
        inlineComment: {
          createComponent: ExampleCreateInlineCommentComponent,
          viewComponent: ExampleViewInlineCommentComponent,
          getState,
        },
      },
    },
  );
};

describe('Annotation toolbar positioning', () => {
  let page: PuppeteerPage;

  describe(`should disable comment button`, () => {
    it(`when selection includes inline nodes`, async () => {
      page = global.page;
      await init(page, adf);
      await scrollToBottom(page);

      await selectAtPosWithProseMirror(page, 1654, 1666);

      // ensure it is disabled
      await retryUntilStablePosition(
        page,
        () =>
          page.waitForSelector(
            `${annotationSelectors.floatingToolbarCreate}[disabled]`,
          ),
        `${annotationSelectors.floatingToolbarCreate}[disabled]`,
        1000,
      );

      await snapshot(page);
    });
  });

  describe(`should show annotation toolbar`, () => {
    beforeEach(async () => {
      page = global.page;
      await init(page, adf);
    });

    afterEach(async () => {
      await page.waitForSelector(annotationSelectors.floatingToolbarCreate);
      await snapshot(page);
    });

    it(`toolbar left by top-line left boundary`, async () => {
      await selectAtPosWithProseMirror(page, 108, 249);
    });

    it(`toolbar left by left editor boundary`, async () => {
      // select upwards
      await selectAtPosWithProseMirror(page, 788, 661);
    });

    it(`toolbar right by top-line right boundary`, async () => {
      await selectAtPosWithProseMirror(page, 7, 73);
    });

    it(`toolbar right by right editor boundary`, async () => {
      await selectAtPosWithProseMirror(page, 45, 127);
    });

    it(`align to mouse cursor and update as selection changes`, async () => {
      await selectAtPosWithProseMirror(page, 142, 281);
      await page.waitForSelector(annotationSelectors.floatingToolbarCreate);
      await snapshot(page);

      // update selection
      const lastPosition = await evaluateCoordinates(page, 296);
      await page.keyboard.down('Shift');
      await page.mouse.click(lastPosition.left, lastPosition.top);
      await page.keyboard.up('Shift');
    });

    it(`across multiple nodes on same line`, async () => {
      await selectAtPosWithProseMirror(page, 1018, 1047);
    });

    it(`across multiple nodes on different lines`, async () => {
      await selectAtPosWithProseMirror(page, 1018, 1114);
    });

    it(`when only whitespace is selected`, async () => {
      await selectAtPosWithProseMirror(page, 8, 7);
    });

    it(`text selection in table cell`, async () => {
      await scrollToElement(page, 'table');

      await selectAtPosWithProseMirror(page, 1365, 1390);
    });

    it(`text selection in wide breakout node`, async () => {
      await selectAtPosWithProseMirror(page, 1, 2);
      await scrollToBottom(page);
      await selectAtPosWithProseMirror(page, 1712, 1686);
    });

    it(`text selection in full width breakout node (left side)`, async () => {
      await scrollToBottom(page);
      await selectAtPosWithProseMirror(page, 2305, 2279);
    });

    it(`text selection in full width breakout node (right side)`, async () => {
      await scrollToBottom(page);
      await selectAtPosWithProseMirror(page, 3010, 3041);
    });
  });

  describe(`should not show annotation toolbar`, () => {
    beforeEach(async () => {
      page = global.page;
      await init(page, adfWithTable);
    });

    it(`column selection`, async () => {
      await page.waitForSelector(tableSelectors.tableWrapper, {
        visible: true,
      });

      await clickFirstCell(page, true);
      await selectColumn(0);
      await page.waitForSelector(tableSelectors.tableColSelected, {
        visible: true,
      });
      await snapshot(page);
    });

    it(`row selection`, async () => {
      await page.waitForSelector(tableSelectors.tableWrapper, {
        visible: true,
      });

      await clickFirstCell(page, true);
      await selectRow(0);
      await snapshot(page);
    });
  });
});
