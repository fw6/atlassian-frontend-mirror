import React, { useState } from 'react';
import { defaultMediaPickerAuthProvider } from '@atlaskit/media-test-helpers';
import { ClipboardConfig } from '@atlaskit/media-picker/types';
import { Clipboard } from '@atlaskit/media-picker';
import { MediaClient, FileIdentifier } from '@atlaskit/media-client';
import { UploadEndEventPayload } from '../../../src/types';
import { Card } from '@atlaskit/media-card';

const ClipBoardExample = () => {
  const [uploadEnd, setUploadEnd] = useState<boolean>(false);
  const [identifier, setIdentifier] = useState<FileIdentifier>({
    mediaItemType: 'file',
    id: '',
  });
  const clipboardConfig: ClipboardConfig = {
    uploadParams: {},
  };

  const mediaClient = new MediaClient({
    authProvider: defaultMediaPickerAuthProvider(),
  });

  if (!clipboardConfig || !mediaClient) {
    return null;
  }
  const onEnd = (payload: UploadEndEventPayload) => {
    setUploadEnd(true);
    setIdentifier((state) => {
      return { ...state, id: payload.file.id };
    });
  };

  return (
    <div>
      <h2>Clipboard example</h2>
      <p>
        Use CMD+C to copy an image from finder, followed by CMD+V to paste the
        image when this window is focused.
      </p>
      <p>
        You can also take a screenshot with SHIFT+CTRL+COMMAND+4 (Mac) and paste
        with CMD+V.
      </p>
      <p>If you paste an image you will see a preview.</p>
      <Clipboard
        mediaClientConfig={mediaClient.config}
        config={clipboardConfig}
        onEnd={onEnd}
      />
      {uploadEnd && (
        <Card mediaClientConfig={mediaClient.config} identifier={identifier} />
      )}
    </div>
  );
};

export default ClipBoardExample;