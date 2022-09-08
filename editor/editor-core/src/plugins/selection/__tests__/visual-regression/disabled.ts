import kitchenSinkAdf from './__fixtures__/kitchen-sink-4.adf.json';
import {
  initEditorWithAdf,
  Appearance,
  updateEditorProps,
  snapshot,
} from '../../../../__tests__/visual-regression/_utils';

import { selectAtPos } from '../../../../__tests__/__helpers/page-objects/_editor';

describe('Selection:', () => {
  let page: PuppeteerPage;

  describe('Disabled', () => {
    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: kitchenSinkAdf,
        viewport: { width: 800, height: 320 },
      });
    });

    it('should be able to select text, when editor is disabled', async () => {
      await updateEditorProps(page, { disabled: true });

      await selectAtPos(page, 10, 50, false);

      await snapshot(page);
    });
  });
});