import { waitForResolvedInlineCard } from '@atlaskit/media-integration-test-helpers';
import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';

describe('Inline Card', () => {
  it.each([
    ['shows default icon on inline cards', 'vr-inline-card-default-icon'],
    ['renders lozenge correctly on inline card', 'vr-inline-card-lozenge'],
    [
      'shows shimmer preloader when icon takes awhile to load',
      'vr-inline-card-loading-icon',
    ],
  ])('%s', async (_: string, testName: string) => {
    const url = getURL(testName);
    const page = await setup(url);

    await waitForResolvedInlineCard(page);
    if (testName === 'vr-inline-card-loading-icon') {
      await page.waitForSelector(
        '[data-testid="inline-card-icon-and-title-loading"]',
      );
    }

    const image = await takeSnapshot(page, 280, 0);
    expect(image).toMatchProdImageSnapshot();
  });
});
