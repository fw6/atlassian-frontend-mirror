import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';
import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/media-with-link.adf.json';

const mediaProvider = storyMediaProviderFactory();
const providerFactory = ProviderFactory.create({ mediaProvider });

export default function Example() {
  return (
    <Renderer
      dataProviders={providerFactory}
      document={document}
      appearance="full-page"
      eventHandlers={{
        link: {
          onClick: () => console.log('onLinkClick'),
        },
        media: {
          onClick: () => console.log('onMediaLink'),
        },
      }}
    />
  );
}
