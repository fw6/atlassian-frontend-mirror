import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '../../../../__tests__/visual-regression/_utils';

import * as adjacentDecisionsAdf from '../__fixtures__/adjacent-decisions-adf.json';

describe('decisions', () => {
  it('adjacent', async () => {
    const { page } = global;
    await initFullPageEditorWithAdf(
      page,
      adjacentDecisionsAdf,
      Device.LaptopMDPI,
    );
    await snapshot(page);
  });
});
