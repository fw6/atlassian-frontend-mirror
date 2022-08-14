import React from 'react';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { ConnectedReactionsView } from '../src';
import { Constants } from '../src/shared';
import { ExampleWrapper } from './utils';

export default function Example() {
  return (
    <ExampleWrapper>
      {(store) => (
        <div>
          <p>
            <strong>
              A "ConnectedReactionsView" with a built in memory store, and with:
              <ul>
                <li>containerAri = {Constants.ContainerAriPrefix}1</li>
                <li>ari = {Constants.AriPrefix}1</li>
              </ul>
              This renders the mockData from the mockClient object (as
              containerAri and ari are matching key)
            </strong>
          </p>
          <hr />
          <ConnectedReactionsView
            store={store}
            containerAri={`${Constants.ContainerAriPrefix}1`}
            ari={`${Constants.AriPrefix}1`}
            emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
          />
          <div style={{ marginTop: '30px' }}>
            <p>
              <strong>
                A "ConnectedReactionsView" with a built in memory store, and
                with:
                <ul>
                  <li>containerAri = {Constants.ContainerAriPrefix}2</li>
                  <li>ari = {Constants.AriPrefix}2</li>
                </ul>
                This renders an empty selected list from the mockClient object
              </strong>
            </p>
            <hr />
          </div>
          <ConnectedReactionsView
            store={store}
            containerAri={`${Constants.ContainerAriPrefix}2`}
            ari={`${Constants.AriPrefix}2`}
            emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
          />
        </div>
      )}
    </ExampleWrapper>
  );
}