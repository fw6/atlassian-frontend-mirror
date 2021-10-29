import {
  FileDetails,
  FileStatus,
  MediaClientErrorReason,
  getMediaClientErrorReason,
  RequestMetadata,
  isRequestError,
} from '@atlaskit/media-client';
import {
  ANALYTICS_MEDIA_CHANNEL,
  FileAttributes,
  PerformanceAttributes,
  OperationalEventPayload,
  UIEventPayload,
  WithFileAttributes,
  WithPerformanceAttributes,
  SuccessAttributes,
  FailureAttributes,
  ScreenEventPayload,
  ScreenAttributes,
} from '@atlaskit/media-common';
import {
  CreateUIAnalyticsEvent,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  isMediaCardError,
  MediaCardError,
  MediaCardErrorPrimaryReason,
} from '../errors';

export type FileUriFailReason = 'local-uri' | 'remote-uri' | `unknown-uri`;
export type FailedErrorFailReason = MediaCardErrorPrimaryReason | 'nativeError';

export type RenderFailedEventPayload = OperationalEventPayload<
  WithFileAttributes &
    WithPerformanceAttributes &
    FailureAttributes & {
      failReason: FailedErrorFailReason | 'failed-processing';
      error?: MediaClientErrorReason | 'nativeError';
      request?: RequestMetadata;
    },
  'failed',
  'mediaCardRender'
>;

export type RenderSucceededEventPayload = OperationalEventPayload<
  WithFileAttributes & WithPerformanceAttributes & SuccessAttributes,
  'succeeded',
  'mediaCardRender'
>;

export type RenderCommencedEventPayload = OperationalEventPayload<
  WithFileAttributes & WithPerformanceAttributes,
  'commenced',
  'mediaCardRender'
>;

export type CopiedFileEventPayload = UIEventPayload<{}, 'copied', string>;

export type ClickedEventPayload = UIEventPayload<
  { label?: string },
  'clicked',
  string
>;

export type RenderScreenEventPayload = Omit<
  ScreenEventPayload<ScreenAttributes, 'mediaCardRenderScreen'>,
  'attributes'
> & {
  attributes: {
    type: string | undefined;
    fileAttributes: FileAttributes;
  };
};

export type MediaCardAnalyticsEventPayload =
  | RenderCommencedEventPayload
  | RenderSucceededEventPayload
  | RenderFailedEventPayload
  | CopiedFileEventPayload
  | ClickedEventPayload
  | RenderScreenEventPayload;

export const getFileAttributes = (
  metadata: FileDetails,
  fileStatus?: FileStatus,
): FileAttributes => ({
  fileMediatype: metadata.mediaType,
  fileMimetype: metadata.mimeType,
  fileId: metadata.id,
  fileSize: metadata.size,
  fileStatus,
});

export const getRenderPreviewableCardPayload = (
  fileAttributes: FileAttributes,
): RenderScreenEventPayload => ({
  eventType: 'screen',
  action: 'viewed',
  actionSubject: 'mediaCardRenderScreen',
  name: 'mediaCardRenderScreen',
  attributes: {
    type: fileAttributes.fileMediatype,
    fileAttributes,
  },
});

export const getRenderCommencedEventPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
): RenderCommencedEventPayload => {
  return {
    eventType: 'operational',
    action: 'commenced',
    actionSubject: 'mediaCardRender',
    attributes: { fileAttributes, performanceAttributes },
  };
};

export const getRenderSucceededEventPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes?: PerformanceAttributes,
): RenderSucceededEventPayload => ({
  eventType: 'operational',
  action: 'succeeded',
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    performanceAttributes,
    status: 'success',
  },
});

export const getRenderFailedExternalUriPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
): RenderFailedEventPayload => ({
  eventType: 'operational',
  action: 'failed',
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    performanceAttributes,
    status: 'fail',
    failReason: 'external-uri',
  },
});

export const getRenderErrorFailReason = (
  error: MediaCardError,
): FailedErrorFailReason => {
  if (isMediaCardError(error)) {
    return error.primaryReason;
  } else {
    return 'nativeError';
  }
};

export const getRenderErrorErrorReason = (
  error: MediaCardError,
): MediaClientErrorReason | 'nativeError' => {
  if (isMediaCardError(error) && error.secondaryError) {
    const mediaClientReason = getMediaClientErrorReason(error.secondaryError);
    if (mediaClientReason !== 'unknown') {
      return mediaClientReason;
    }
  }
  return 'nativeError';
};

export const getRenderErrorErrorDetail = (error: MediaCardError): string => {
  if (isMediaCardError(error) && error.secondaryError) {
    return error.secondaryError.message;
  } else {
    return error.message;
  }
};

export const getRenderErrorRequestMetadata = (
  error: MediaCardError,
): RequestMetadata | undefined => {
  if (
    isMediaCardError(error) &&
    !!error.secondaryError &&
    isRequestError(error.secondaryError)
  ) {
    return error.secondaryError.metadata;
  }
};

export const getRenderErrorEventPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
  error: MediaCardError,
): RenderFailedEventPayload => ({
  eventType: 'operational',
  action: 'failed',
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    performanceAttributes,
    status: 'fail',
    failReason: getRenderErrorFailReason(error),
    error: getRenderErrorErrorReason(error),
    errorDetail: getRenderErrorErrorDetail(error),
    request: getRenderErrorRequestMetadata(error),
  },
});

export const getRenderFailedFileStatusPayload = (
  fileAttributes: FileAttributes,
  performanceAttributes: PerformanceAttributes,
): RenderFailedEventPayload => ({
  eventType: 'operational',
  action: 'failed',
  actionSubject: 'mediaCardRender',
  attributes: {
    fileAttributes,
    performanceAttributes,
    status: 'fail',
    failReason: 'failed-processing',
  },
});

export const getCopiedFilePayload = (
  fileId: string,
): CopiedFileEventPayload => ({
  eventType: 'ui',
  action: 'copied',
  actionSubject: 'file',
  actionSubjectId: fileId,
  attributes: {},
});

export function fireMediaCardEvent(
  payload: MediaCardAnalyticsEventPayload,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) {
  if (createAnalyticsEvent) {
    const event = createAnalyticsEvent(payload);
    event.fire(ANALYTICS_MEDIA_CHANNEL);
  }
}

export const createAndFireMediaCardEvent = (
  payload: MediaCardAnalyticsEventPayload,
) => {
  return createAndFireEvent(ANALYTICS_MEDIA_CHANNEL)(payload);
};
