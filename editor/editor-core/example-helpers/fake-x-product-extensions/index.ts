import { manifest as jqlTable } from './jql-table';
import { manifest as loremIpsum } from './lorem-ipsum';
import { manifest as awesomeExtension } from './awesome';
import dropbox from '@atlaskit/editor-extension-dropbox';

import { DefaultExtensionProvider } from '@atlaskit/editor-common';

export const getXProductExtensionProvider = () =>
  new DefaultExtensionProvider([
    jqlTable,
    loremIpsum,
    awesomeExtension,
    // BC: This API key currently only gives permission to me to access dropbox
    // If you need to test this, lmk, and I will add you, or you can make your own app
    dropbox({ appKey: '3wzehwdgypoymz9', canMountinIframe: true }),
  ]);
