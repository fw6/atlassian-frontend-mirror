import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  editable,
  gotoEditor,
  linkUrlSelector,
  linkRecentList,
  insertLongText,
} from '../../_helpers';
import { messages } from '../../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';

BrowserTestCase(
  `card: selecting a link from CMD + K menu should create an inline card with click`,
  {
    // to fix safari skip: https://product-fabric.atlassian.net/browse/EDM-1160
    skip: ['edge', 'safari'],
  },
  async (client: ConstructorParameters<typeof Page>[0], testName: string) => {
    const page = new Page(client);

    await gotoEditor(page);

    await insertLongText(page);
    await page.click(`[aria-label="${messages.link.defaultMessage}"]`);
    await page.waitForSelector(linkUrlSelector);

    await page.type(linkUrlSelector, ['home opt-in']);
    await page.click(`${linkRecentList} ul li`);
    await page.waitForSelector('[data-testid="inline-card-resolved-view"]');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);