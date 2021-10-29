import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
  retryUntilStablePosition,
} from '../../__helpers/page-objects/_toolbar';
import {
  clickBlockMenuItem,
  BlockMenuItem,
} from '../../__helpers/page-objects/_blocks';
import {
  clickOnExtension,
  extensionSelectors,
  extensionWidthSelectors,
  waitForExtensionToolbar,
} from '../../__helpers/page-objects/_extensions';
import adf from './__fixtures__/extension-wide.adf.json';
import defaultBodiedAdf from './__fixtures__/bodied-extension-default.adf.json';
import extensionLayouts from './__fixtures__/extension-layouts.adf.json';
import { EditorProps } from '../../../types/editor-props';

describe('Extension:', () => {
  const initEditor = async (
    adf?: Object,
    viewport:
      | {
          width: number;
          height: number;
        }
      | undefined = { width: 1040, height: 400 },
    editorProps?: EditorProps,
  ) => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport,
      adf,
      editorProps,
    });
  };

  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  it('should insert a block extension with a selected state.', async () => {
    await initEditor();
    await clickBlockMenuItem(page, BlockMenuItem.blockExtension);
    await snapshot(page);
  });

  it('should insert a bodied extension without a selected state.', async () => {
    await initEditor();
    await clickBlockMenuItem(page, BlockMenuItem.bodiedExtension);
    await snapshot(page);
  });

  it('should display a selected ring around a breakout extension', async () => {
    await initEditor(adf);
    await clickOnExtension(
      page,
      'com.atlassian.confluence.macro.core',
      'block-eh',
    );
    await snapshot(page);
  });

  it('should render different extension layouts correctly', async () => {
    await initEditor(extensionLayouts, { width: 1040, height: 2200 });
    await snapshot(page);
  });

  describe('Undo Redo', () => {
    beforeEach(async () => {
      await initEditor(defaultBodiedAdf, undefined, {
        featureFlags: { undoRedoButtons: true },
        UNSAFE_allowUndoRedoButtons: true,
      });
      await clickOnExtension(
        page,
        'com.atlassian.confluence.macro.core',
        'bodied-eh',
      );
      await waitForExtensionToolbar(page);
    });

    const selectWideLayout = async () => {
      await page.click(extensionSelectors.goWide);
      await retryUntilStablePosition(
        page,
        async () => {
          await page.waitForSelector(extensionWidthSelectors.wide);
        },
        extensionWidthSelectors.wide,
      );
    };

    const undo = async () => {
      await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.undo]);
      await page.waitForSelector(extensionWidthSelectors.default);
      await retryUntilStablePosition(
        page,
        async () => {
          await page.waitForSelector(extensionWidthSelectors.default);
        },
        extensionWidthSelectors.default,
      );
    };

    it('should revert the layout correctly when undo is triggered', async () => {
      // should show the default layout selected
      await snapshot(page);

      await selectWideLayout();
      // should show the wide layout selected
      await snapshot(page);

      await undo();
      // should show the default layout selected
      await snapshot(page);
    });

    it('should revert the layout correctly when redo is triggered', async () => {
      await selectWideLayout();
      await undo();

      await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.redo]);
      await page.waitForSelector(extensionWidthSelectors.wide);
      await retryUntilStablePosition(
        page,
        async () => {
          await page.waitForSelector(extensionWidthSelectors.wide);
        },
        extensionWidthSelectors.wide,
      );
      // should show the wide layout selected
      await snapshot(page);
    });
  });
});
