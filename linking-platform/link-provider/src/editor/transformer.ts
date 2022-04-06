import {
  CardAppearance,
  BlockCardAdf,
  CardAdf,
  EmbedCardAdf,
  InlineCardAdf,
} from '@atlaskit/linking-common';

const isJiraRoadMap = (url: string) =>
  url.match(
    /^https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/boards\/.*?\/roadmap\/?/,
  );

const isPolarisView = (url: string) =>
  url.match(
    /^https:\/\/.*?\/jira\/polaris\/projects\/[^\/]+?\/ideas\/view\/\d+$|^https:\/\/.*?\/secure\/JiraProductDiscoveryAnonymous\.jspa\?hash=\w+|^https:\/\/.*?\/jira\/polaris\/share\/\w+/,
  );

const isJwmView = (url: string) =>
  url.match(
    /^https:\/\/.*?\/jira\/core\/projects\/[^\/]+?\/(timeline|calendar|list|board)\/?/,
  );

const isSlackMessage = (url: string) =>
  url.match(
    /^https:\/\/.+?\.slack\.com\/archives\/[CG][A-Z0-9]+\/p[0-9]+(\?.*)?$/,
  );

export class Transformer {
  private buildInlineAdf(url: string): InlineCardAdf {
    return {
      type: 'inlineCard',
      attrs: {
        url,
      },
    };
  }

  private buildBlockAdf(url: string): BlockCardAdf {
    return {
      type: 'blockCard',
      attrs: {
        url,
      },
    };
  }

  private buildEmbedAdf(url: string): EmbedCardAdf {
    return {
      type: 'embedCard',
      attrs: {
        url,
        layout: 'wide',
      },
    };
  }

  toAdf(url: string, appearance: CardAppearance): CardAdf {
    if (isJiraRoadMap(url) || isPolarisView(url) || isJwmView(url)) {
      return this.buildEmbedAdf(url);
    } else if (isSlackMessage(url)) {
      return this.buildBlockAdf(url);
    } else {
      switch (appearance) {
        case 'inline':
          return this.buildInlineAdf(url);
        case 'block':
          return this.buildBlockAdf(url);
        case 'embed':
          return this.buildEmbedAdf(url);
      }
    }
  }
}