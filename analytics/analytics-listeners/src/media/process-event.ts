import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { DEFAULT_SOURCE, GasPayload } from '@atlaskit/analytics-gas-types';

import {
  getPackageHierarchy,
  getSources,
  getPackageInfo,
  getComponents,
  extractFromEventContext,
  getExtraAttributes,
} from '../atlaskit/extract-data-from-event';
import merge from 'lodash/merge';
import last from 'lodash/last';
import { version as listenerVersion } from '../version.json';

const MEDIA_CONTEXT = 'mediaCtx';

function getMediaContexts(event: UIAnalyticsEvent) {
  return extractFromEventContext(MEDIA_CONTEXT, event);
}

function getMediaRegion() {
  return (
    window &&
    window.sessionStorage &&
    window.sessionStorage.getItem('media-api-region')
  );
}

export function processEvent(event: UIAnalyticsEvent): GasPayload {
  const sources = getSources(event);
  const { packageName, packageVersion } =
    last(getPackageInfo(event)) || ({} as any);

  const extraAttributes = getExtraAttributes(event);

  const mediaContexts = getMediaContexts(event) || [];
  const mediaAttributes = merge({}, ...mediaContexts);

  const tags: Set<string> = new Set(event.payload.tags || []);
  tags.add('media');

  const components = getComponents(event);

  const mediaRegion = getMediaRegion();

  const payload = {
    source: last(sources) || DEFAULT_SOURCE,
    actionSubject: event.payload.actionSubject,
    action: event.payload.action,
    eventType: event.payload.eventType,
    actionSubjectId: event.payload.actionSubjectId,
    tags: Array.from(tags),
    attributes: {
      packageName,
      packageVersion,
      ...merge({}, extraAttributes, mediaAttributes, event.payload.attributes),
      componentHierarchy: components.join('.') || undefined,
      packageHierarchy: getPackageHierarchy(event),
      sourceHierarchy: sources.join('.') || undefined,
      listenerVersion,
      ...(mediaRegion ? { mediaRegion } : undefined),
    },
  };

  return payload;
}