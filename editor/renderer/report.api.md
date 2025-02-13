<!-- API Report Version: 2.3 -->

## API Report File for "@atlaskit/renderer"

> Do not edit this file. This report is auto-generated using [API Extractor](https://api-extractor.com/).
> [Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

### Table of contents

- [Main Entry Types](#main-entry-types)
- [Peer Dependencies](#peer-dependencies)

### Main Entry Types

<!--SECTION START: Main Entry Types-->

```ts
/// <reference types="react" />

import { ACTION } from '@atlaskit/editor-common/analytics';
import { ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
import { ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import type { ADFStage } from '@atlaskit/editor-common/validator';
import type { AnnotationProviders } from '@atlaskit/editor-common/types';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { DocNode } from '@atlaskit/adf-schema';
import { EmojiResourceConfig } from '@atlaskit/emoji/resource';
import { EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { Fragment } from 'prosemirror-model';
import { jsx } from '@emotion/react';
import { Mark } from 'prosemirror-model';
import { MediaClientConfig } from '@atlaskit/media-core';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { Node as Node_2 } from 'prosemirror-model';
import { PropsDifference } from '@atlaskit/editor-common/utils';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { Schema } from 'prosemirror-model';
import { SEVERITY } from '@atlaskit/editor-common/utils';
import { ShallowPropsDifference } from '@atlaskit/editor-common/utils';
import { SortOrder } from '@atlaskit/editor-common/types';
import { SSR } from '@atlaskit/media-common';
import type { Transformer as Transformer_2 } from '@atlaskit/editor-common/types';
import { UNSUPPORTED_CONTENT_LEVEL_SEVERITY } from '@atlaskit/editor-common/utils';
import type { UnsupportedContentLevelsTracking } from '@atlaskit/editor-common/utils';
import type { UnsupportedContentPayload } from '@atlaskit/editor-common/utils';
import type { UnsupportedContentTooltipPayload } from '@atlaskit/editor-common/utils';

// @public (undocumented)
export class ADFEncoder<T> {
  constructor(createTransformerWithSchema: TransformerProvider<T>);
  // (undocumented)
  encode: (value: T) => any;
}

// @public (undocumented)
type AEP<Action, ActionSubject, ActionSubjectID, Attributes, EventType> = {
  action: Action;
  actionSubject: ActionSubject;
  actionSubjectId?: ActionSubjectID;
  attributes?: Attributes;
  eventType: EventType;
};

// @public (undocumented)
type AnalyticsEventPayload<T = void> =
  | AnchorLinkAEP
  | AnnotationAEP
  | AnnotationDeleteAEP
  | ComponentCrashErrorAEP
  | ExpandAEP
  | HeadingAnchorLinkButtonAEP
  | InvalidProsemirrorDocumentErrorAEP
  | MediaLnkTransformedAEP
  | RendererReRenderedAEP<T>
  | RendererRenderedAEP
  | RendererSelectAllCaughtAEP
  | RendererSelectAllEscapedAEP
  | RendererStartAEP
  | RendererTTIAEP
  | RendererUnsupportedContentLevelsTrackingErrored
  | RendererUnsupportedContentLevelsTrackingSucceeded
  | TableSortColumnAEP
  | TableSortColumnNotAllowedAEP
  | UnsupportedContentPayload
  | UnsupportedContentTooltipPayload
  | VisitLinkAEP
  | VisitMediaLinkAEP;

// @public (undocumented)
type AnchorLinkAEP = UIAEP<
  ACTION.VIEWED,
  ACTION_SUBJECT.ANCHOR_LINK,
  undefined,
  {
    platform: PLATFORM.WEB;
    mode: MODE.RENDERER;
  }
>;

// @public (undocumented)
type AnnotationActionType =
  | ACTION.CLOSED
  | ACTION.CREATE_NOT_ALLOWED
  | ACTION.DELETED
  | ACTION.EDITED
  | ACTION.INSERTED
  | ACTION.OPENED
  | ACTION.RESOLVED
  | ACTION.VIEWED;

// @public (undocumented)
type AnnotationAEP = AEP<
  AnnotationActionType,
  ACTION_SUBJECT.ANNOTATION,
  ACTION_SUBJECT_ID.INLINE_COMMENT,
  AnnotationAEPAttributes,
  undefined
>;

// @public (undocumented)
type AnnotationAEPAttributes =
  | AnnotationDraftAEPAttributes
  | AnnotationResolvedAEPAttributes;

// @public (undocumented)
type AnnotationDeleteAEP = AEP<
  AnnotationActionType,
  ACTION_SUBJECT.ANNOTATION,
  ACTION_SUBJECT_ID,
  undefined,
  EVENT_TYPE.TRACK
>;

// @public (undocumented)
type AnnotationDraftAEPAttributes = {
  overlap?: number;
};

// @public (undocumented)
type AnnotationResolvedAEPAttributes = {
  method?: RESOLVE_METHOD;
};

// @public (undocumented)
type ButtonAEP<ActionSubjectID, Attributes> = UIAEP<
  ACTION.CLICKED,
  ACTION_SUBJECT.BUTTON,
  ActionSubjectID,
  Attributes
>;

// @public (undocumented)
type ComponentCrashErrorAEP = AEP<
  ACTION.CRASHED,
  ACTION_SUBJECT.RENDERER,
  ACTION_SUBJECT_ID,
  {
    platform: PLATFORM.WEB;
    errorMessage?: string;
    errorStack?: string;
    componentStack?: string;
    errorRethrown?: boolean;
  },
  EVENT_TYPE.OPERATIONAL
>;

// @public (undocumented)
type DispatchAnalyticsEvent = (event: AnalyticsEventPayload) => void;

// @public (undocumented)
type ExpandAEP = AEP<
  ACTION.TOGGLE_EXPAND,
  ACTION_SUBJECT.EXPAND | ACTION_SUBJECT.NESTED_EXPAND,
  undefined,
  {
    platform: PLATFORM.WEB;
    mode: MODE.RENDERER;
    expanded: boolean;
  },
  EVENT_TYPE.TRACK
>;

// @public (undocumented)
type HeadingAnchorLinkButtonAEP = ButtonAEP<
  ACTION_SUBJECT_ID.HEADING_ANCHOR_LINK,
  undefined
>;

// @public (undocumented)
type HeadingAnchorLinksConfig = {
  activeHeadingId?: string;
  allowNestedHeaderLinks?: boolean;
};

// @public (undocumented)
export type HeadingAnchorLinksProps = HeadingAnchorLinksConfig | boolean;

// @public (undocumented)
type InvalidProsemirrorDocumentErrorAEP = AEP<
  ACTION.INVALID_PROSEMIRROR_DOCUMENT,
  ACTION_SUBJECT.RENDERER,
  ACTION_SUBJECT_ID,
  {
    platform: PLATFORM.WEB;
    errorStack?: string;
  },
  EVENT_TYPE.OPERATIONAL
>;

// @public (undocumented)
type MediaLnkTransformedAEP = AEP<
  ACTION.MEDIA_LINK_TRANSFORMED,
  ACTION_SUBJECT.RENDERER,
  undefined,
  undefined,
  EVENT_TYPE.OPERATIONAL
>;

// @public (undocumented)
interface MediaOptions {
  // (undocumented)
  allowLinking?: boolean;
  // (undocumented)
  enableDownloadButton?: boolean;
  // (undocumented)
  featureFlags?: MediaFeatureFlags;
  // (undocumented)
  ssr?: MediaSSR;
}

// @public (undocumented)
export type MediaSSR = {
  mode: SSR;
  config: MediaClientConfig;
};

// @public (undocumented)
enum MODE {
  // (undocumented)
  EDITOR = 'editor',
  // (undocumented)
  RENDERER = 'renderer',
}

// @public (undocumented)
type NodeComponentsProps = {
  [key: string]: React.ComponentType<any>;
};

// @public (undocumented)
interface ParentInfo {
  // (undocumented)
  parentIsIncompleteTask: boolean;
  // (undocumented)
  path: Array<Node_2>;
  // (undocumented)
  pos: number;
}

// @public (undocumented)
enum PLATFORM {
  // (undocumented)
  HYBRID = 'mobileHybrid',
  // (undocumented)
  NATIVE = 'mobileNative',
  // (undocumented)
  WEB = 'web',
}

// @public (undocumented)
interface RawObjectFeatureFlags {
  // (undocumented)
  ['renderer-render-tracking']: string;
}

// @public (undocumented)
export const ReactRenderer: (props: RendererProps) => jsx.JSX.Element;

// @public (undocumented)
export class ReactSerializer implements Serializer<JSX.Element> {
  constructor(init: ReactSerializerInit);
  // (undocumented)
  static buildMarkStructure(content: Node_2[]): Mark<any>[];
  // (undocumented)
  static fromSchema(_: unknown, init: ReactSerializerInit): ReactSerializer;
  // (undocumented)
  static getChildNodes(fragment: Fragment): (Node_2 | TextWrapper)[];
  // (undocumented)
  static getMarks(node: Node_2): Mark[];
  // (undocumented)
  serializeFragment(
    fragment: Fragment,
    props?: any,
    target?: any,
    key?: string,
    parentInfo?: ParentInfo,
  ): JSX.Element | null;
}

// @public (undocumented)
interface ReactSerializerInit {
  // (undocumented)
  allowAltTextOnImages?: boolean;
  // (undocumented)
  allowAnnotations?: boolean;
  // (undocumented)
  allowColumnSorting?: boolean;
  // (undocumented)
  allowCopyToClipboard?: boolean;
  // (undocumented)
  allowCustomPanels?: boolean;
  // (undocumented)
  allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
  // (undocumented)
  allowMediaLinking?: boolean;
  // (undocumented)
  allowPlaceholderText?: boolean;
  // (undocumented)
  allowSelectAllTrap?: boolean;
  // (undocumented)
  allowWindowedCodeBlock?: boolean;
  // (undocumented)
  appearance?: RendererAppearance;
  // (undocumented)
  disableActions?: boolean;
  // (undocumented)
  disableHeadingIDs?: boolean;
  // (undocumented)
  emojiResourceConfig?: EmojiResourceConfig;
  // (undocumented)
  eventHandlers?: EventHandlers;
  // (undocumented)
  extensionHandlers?: ExtensionHandlers;
  // (undocumented)
  fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
  // (undocumented)
  media?: MediaOptions;
  // (undocumented)
  nodeComponents?: NodeComponentsProps;
  // (undocumented)
  objectContext?: RendererContext;
  // (undocumented)
  portal?: HTMLElement;
  // (undocumented)
  providers?: ProviderFactory;
  // (undocumented)
  shouldOpenMediaViewer?: boolean;
  // (undocumented)
  smartLinks?: SmartLinksOptions;
  // (undocumented)
  stickyHeaders?: StickyHeaderConfig;
  // (undocumented)
  surroundTextNodesWithTextWrapper?: boolean;
}

// @public (undocumented)
export const renderDocument: <T>(
  doc: any,
  serializer: Serializer<T>,
  schema?: Schema,
  adfStage?: ADFStage,
  useSpecBasedValidator?: boolean,
  rendererId?: string,
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent | undefined,
  unsupportedContentLevelsTracking?:
    | UnsupportedContentLevelsTracking
    | undefined,
  appearance?: RendererAppearance,
) => RenderOutput<T | null>;

// @public (undocumented)
export type RendererAppearance =
  | 'comment'
  | 'full-page'
  | 'full-width'
  | 'mobile'
  | undefined;

// @public (undocumented)
export interface RendererContext {
  // (undocumented)
  adDoc?: any;
  // (undocumented)
  containerAri?: string;
  // (undocumented)
  objectAri?: string;
  // (undocumented)
  schema?: Schema;
}

// @public (undocumented)
export interface RendererProps {
  // (undocumented)
  adfStage?: ADFStage;
  // (undocumented)
  allowAltTextOnImages?: boolean;
  // (undocumented)
  allowAnnotations?: boolean;
  // (undocumented)
  allowColumnSorting?: boolean;
  // (undocumented)
  allowCopyToClipboard?: boolean;
  // (undocumented)
  allowCustomPanels?: boolean;
  // (undocumented)
  allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
  // (undocumented)
  allowPlaceholderText?: boolean;
  // (undocumented)
  allowSelectAllTrap?: boolean;
  // (undocumented)
  allowUgcScrubber?: boolean;
  // (undocumented)
  analyticsEventSeverityTracking?: {
    enabled: boolean;
    severityNormalThreshold: number;
    severityDegradedThreshold: number;
  };
  // (undocumented)
  annotationProvider?: AnnotationProviders | null;
  // (undocumented)
  appearance?: RendererAppearance;
  // (undocumented)
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  // (undocumented)
  dataProviders?: ProviderFactory;
  // (undocumented)
  disableActions?: boolean;
  // (undocumented)
  disableHeadingIDs?: boolean;
  // (undocumented)
  document: DocNode;
  // (undocumented)
  emojiResourceConfig?: EmojiResourceConfig;
  // (undocumented)
  enableSsrInlineScripts?: boolean;
  // (undocumented)
  eventHandlers?: EventHandlers;
  // (undocumented)
  extensionHandlers?: ExtensionHandlers;
  // (undocumented)
  fadeOutHeight?: number;
  featureFlags?:
    | Partial<RawObjectFeatureFlags>
    | {
        [featureFlag: string]: boolean;
      };
  // (undocumented)
  innerRef?: React.RefObject<HTMLDivElement>;
  // (undocumented)
  maxHeight?: number;
  // (undocumented)
  media?: MediaOptions;
  // (undocumented)
  nodeComponents?: NodeComponentsProps;
  // (undocumented)
  onComplete?: (stat: RenderOutputStat) => void;
  // (undocumented)
  onError?: (error: any) => void;
  // (undocumented)
  portal?: HTMLElement;
  // (undocumented)
  rendererContext?: RendererContext;
  // (undocumented)
  schema?: Schema;
  // (undocumented)
  shouldOpenMediaViewer?: boolean;
  // (undocumented)
  smartLinks?: SmartLinksOptions;
  // (undocumented)
  stickyHeaders?: StickyHeaderProps;
  // (undocumented)
  truncated?: boolean;
  // (undocumented)
  unsupportedContentLevelsTracking?: UnsupportedContentLevelsTracking;
  // (undocumented)
  useSpecBasedValidator?: boolean;
}

// @public (undocumented)
type RendererRenderedAEP = AEP<
  ACTION.RENDERED,
  ACTION_SUBJECT.RENDERER,
  undefined,
  {
    platform: PLATFORM.WEB;
    duration: number;
    distortedDuration: boolean;
    ttfb?: number;
    nodes: Record<string, number>;
    severity?: SEVERITY;
  },
  EVENT_TYPE.OPERATIONAL
>;

// @public (undocumented)
type RendererReRenderedAEP<Props> = AEP<
  ACTION.RE_RENDERED,
  ACTION_SUBJECT.RENDERER,
  undefined,
  {
    propsDifference: PropsDifference<Props> | ShallowPropsDifference<Props>;
    count: number;
    componentId?: string;
  },
  EVENT_TYPE.OPERATIONAL
>;

// @public (undocumented)
type RendererSelectAllCaughtAEP = AEP<
  ACTION.SELECT_ALL_CAUGHT,
  ACTION_SUBJECT.RENDERER,
  undefined,
  {
    platform: PLATFORM.WEB;
  },
  EVENT_TYPE.TRACK
>;

// @public (undocumented)
type RendererSelectAllEscapedAEP = AEP<
  ACTION.SELECT_ALL_ESCAPED,
  ACTION_SUBJECT.RENDERER,
  undefined,
  {
    platform: PLATFORM.WEB;
  },
  EVENT_TYPE.TRACK
>;

// @public (undocumented)
type RendererStartAEP = AEP<
  ACTION.STARTED,
  ACTION_SUBJECT.RENDERER,
  undefined,
  {
    platform: PLATFORM.WEB;
  },
  EVENT_TYPE.UI
>;

// @public (undocumented)
type RendererTTIAEP = AEP<
  ACTION.RENDERER_TTI,
  ACTION_SUBJECT.RENDERER,
  undefined,
  {
    tti: number;
    ttiFromInvocation: number;
    canceled: boolean;
  },
  EVENT_TYPE.OPERATIONAL
>;

// @public (undocumented)
type RendererUnsupportedContentLevelsTrackingErrored = AEP<
  ACTION.UNSUPPORTED_CONTENT_LEVELS_TRACKING_ERRORED,
  ACTION_SUBJECT.RENDERER,
  undefined,
  {
    platform: PLATFORM.WEB;
    error: string;
  },
  EVENT_TYPE.OPERATIONAL
>;

// @public (undocumented)
type RendererUnsupportedContentLevelsTrackingSucceeded = AEP<
  ACTION.UNSUPPORTED_CONTENT_LEVELS_TRACKING_SUCCEEDED,
  ACTION_SUBJECT.RENDERER,
  undefined,
  {
    appearance?: string;
    platform: PLATFORM.WEB;
    unsupportedContentLevelSeverity: UNSUPPORTED_CONTENT_LEVEL_SEVERITY;
    unsupportedContentLevelPercentage: number;
    unsupportedNodesCount: number;
    supportedNodesCount: number;
  },
  EVENT_TYPE.OPERATIONAL
>;

// @public (undocumented)
interface RenderOutput<T> {
  // (undocumented)
  pmDoc?: Node_2;
  // (undocumented)
  result: T;
  // (undocumented)
  stat: RenderOutputStat;
}

// @public (undocumented)
export interface RenderOutputStat {
  // (undocumented)
  buildTreeTime?: number;
  // (undocumented)
  sanitizeTime: number;
  // (undocumented)
  serializeTime?: number;
}

// @public (undocumented)
enum RESOLVE_METHOD {
  // (undocumented)
  COMPONENT = 'component',
  // (undocumented)
  CONSUMER = 'consumer',
  // (undocumented)
  ORPHANED = 'orphaned',
}

// @public (undocumented)
export interface Serializer<T> {
  // (undocumented)
  serializeFragment(
    fragment: Fragment,
    props?: any,
    target?: any,
    key?: string,
  ): T | null;
}

// @public (undocumented)
interface SmartLinksOptions {
  // (undocumented)
  ssr?: boolean;
}

// @public (undocumented)
type StickyHeaderConfig = {
  offsetTop?: number;
};

// @public (undocumented)
type StickyHeaderProps =
  | ({
      show?: boolean;
    } & StickyHeaderConfig)
  | boolean;

// @public (undocumented)
type TableSortColumnAEP = AEP<
  ACTION.SORT_COLUMN,
  ACTION_SUBJECT.TABLE,
  undefined,
  {
    platform: PLATFORM.WEB;
    mode: MODE.RENDERER;
    sortOrder: SortOrder;
    columnIndex: number;
  },
  EVENT_TYPE.TRACK
>;

// @public (undocumented)
type TableSortColumnNotAllowedAEP = AEP<
  ACTION.SORT_COLUMN_NOT_ALLOWED,
  ACTION_SUBJECT.TABLE,
  undefined,
  {
    platform: PLATFORM.WEB;
    mode: MODE.RENDERER;
  },
  EVENT_TYPE.TRACK
>;

// @public (undocumented)
export class TextSerializer implements Serializer<string> {
  constructor(schema: Schema);
  // (undocumented)
  static fromSchema(schema?: Schema): TextSerializer;
  // (undocumented)
  serializeFragment(fragment: Fragment): string;
}

// @public (undocumented)
interface TextWrapper {
  // (undocumented)
  content: Node_2[];
  // (undocumented)
  nodeSize: number;
  // (undocumented)
  type: {
    name: 'textWrapper';
  };
}

// @public (undocumented)
type TransformerProvider<T> = (schema: Schema) => Transformer_2<T>;

// @public (undocumented)
type UIAEP<Action, ActionSubject, ActionSubjectID, Attributes> = AEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  EVENT_TYPE.UI
>;

// @public (undocumented)
type VisitLinkAEP = AEP<
  ACTION.VISITED,
  ACTION_SUBJECT.LINK,
  undefined,
  {
    platform: PLATFORM.WEB;
    mode: MODE.RENDERER;
  },
  EVENT_TYPE.TRACK
>;

// @public (undocumented)
type VisitMediaLinkAEP = AEP<
  ACTION.VISITED,
  ACTION_SUBJECT.MEDIA,
  ACTION_SUBJECT_ID.LINK,
  {
    platform: PLATFORM.WEB;
    mode: MODE.RENDERER;
  },
  EVENT_TYPE.TRACK
>;

// (No @packageDocumentation comment for this package)
```

<!--SECTION END: Main Entry Types-->

### Peer Dependencies

<!--SECTION START: Peer Dependencies-->

```json
{
  "@atlaskit/link-provider": "^1.3.4",
  "@atlaskit/media-core": "^34.0.1",
  "react": "^16.8.0",
  "react-dom": "^16.8.0"
}
```

<!--SECTION END: Peer Dependencies-->
