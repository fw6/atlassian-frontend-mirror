import { MediaClient, FileState } from '@atlaskit/media-client';

export type ArchiveViewerProps = {
  mediaClient: MediaClient;
  item: FileState;
  collectionName?: string;
};