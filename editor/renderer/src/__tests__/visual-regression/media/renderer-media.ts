import { snapshot, Device, initRendererWithADF } from '../_utils';
import * as resizeAdf from './__fixtures__/renderer-media.adf.json';
import * as commentRendererAdf from './__fixtures__/comment-renderer-media-adf.json';
import * as wrappedMediaADf from './__fixtures__/wrapped-media.adf.json';

import * as layoutAdf from '../../../../examples/helper/media-resize-layout.adf.json';
import { selectors as mediaSelectors } from '../../__helpers/page-objects/_media';
import { selectors as rendererSelectors } from '../../__helpers/page-objects/_renderer';
import { Page } from 'puppeteer';
import { RendererAppearance } from '../../../ui/Renderer/types';

const devices = [
  // TODO: ED-7455
  // Device.LaptopHiDPI,
  // Device.LaptopMDPI,
  Device.iPad,
  Device.iPadPro,
  Device.iPhonePlus,
];

const initRenderer = async (
  page: Page,
  adf: any,
  device?: Device,
  appearance: RendererAppearance = 'full-page',
) =>
  await initRendererWithADF(page, {
    appearance,
    rendererProps: { allowDynamicTextSizing: true, disableHeadingIDs: true },
    adf,
    device,
  });
// TODO: https://product-fabric.atlassian.net/browse/ED-8011
// ED-8011 Implement proper mock for media client on Renderer VR Tests.
describe.skip('Snapshot Test: Media', () => {
  let page: Page;

  beforeEach(() => {
    page = global.page;
  });

  afterEach(async () => {
    await page.waitForSelector(mediaSelectors.errorLoading); // In test should show overlay error
    await page.waitForSelector(rendererSelectors.document);
    await snapshot(page, {}, rendererSelectors.document);
  });

  describe('resize', () => {
    devices.forEach(device => {
      // TODO: ED-7455
      it.skip(`should correctly render for ${device}`, async () => {
        await initRenderer(page, resizeAdf, device);
      });
    });
  });

  describe('layout', () => {
    devices.forEach(device => {
      // TODO: ED-8011
      it.skip(`should correctly render for ${device}`, async () => {
        await initRenderer(page, layoutAdf, device);
      });
    });
  });

  describe('comment appearance', () => {
    it('should renderer the same size for comment apperance', async () => {
      await initRenderer(page, commentRendererAdf, undefined, 'comment');
    });
  });

  describe('wrapped media', () => {
    it('should render 2 media items in 1 line when wrapped', async () => {
      await initRenderer(page, wrappedMediaADf);
    });
  });
});
