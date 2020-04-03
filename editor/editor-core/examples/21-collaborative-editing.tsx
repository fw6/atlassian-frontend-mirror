/* eslint-disable no-console */
import URLSearchParams from 'url-search-params';
import styled from 'styled-components';
import React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';

import Editor from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { mention, emoji, taskDecision } from '@atlaskit/util-data-test';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import { EditorActions } from '../src';

import { Provider } from '@atlaskit/collab-provider';

export const getRandomUser = () => {
  return Math.floor(Math.random() * 10000).toString();
};

const userId = `ari:cloud:identity::user/${getRandomUser()}`;
const defaultCollabUrl = 'https://pf-collab-service.stg.services.atlassian.com';

export const Content: any = styled.div`
  padding: 0 20px;
  height: 50%;
  background: #fff;
  box-sizing: border-box;
`;
Content.displayName = 'Content';

const analyticsHandler = (actionName: string, props?: {}) =>
  console.log(actionName, props);

const SaveAndCancelButtons = (props: { editorActions: EditorActions }) => (
  <ButtonGroup>
    <Button
      appearance="primary"
      onClick={() =>
        props.editorActions
          .getValue()
          .then(value => console.log(value.toJSON()))
      }
    >
      Publish
    </Button>
    <Button appearance="subtle" onClick={() => props.editorActions.clear()}>
      Close
    </Button>
  </ButtonGroup>
);

interface DropzoneEditorWrapperProps {
  children: (container: HTMLElement) => React.ReactNode;
}

class DropzoneEditorWrapper extends React.Component<
  DropzoneEditorWrapperProps,
  {}
> {
  dropzoneContainer: HTMLElement | null = null;

  handleRef = (node: HTMLElement) => {
    this.dropzoneContainer = node;
    this.forceUpdate();
  };

  render() {
    return (
      <Content innerRef={this.handleRef}>
        {this.dropzoneContainer
          ? this.props.children(this.dropzoneContainer)
          : null}
      </Content>
    );
  }
}

const mediaProvider = storyMediaProviderFactory();

export type Props = {};
export type State = {
  isInviteToEditButtonSelected: boolean;
  documentId?: string;
  collabUrl?: string;
  documentIdInput?: HTMLInputElement;
  collabUrlInput?: HTMLInputElement;
  hasError?: boolean;
};

const getQueryParam = (param: string) => {
  const urlParams = new URLSearchParams(document.location.search);
  return urlParams.get(param);
};

export default class Example extends React.Component<Props, State> {
  state = {
    isInviteToEditButtonSelected: false,
    documentId: getQueryParam('documentId'),
    collabUrl: getQueryParam('collabUrl') || defaultCollabUrl,
    documentIdInput: undefined,
    collabUrlInput: undefined,
    hasError: false,
  };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  renderErrorFlag() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            margin: 0,
            backgroundColor: '#FF5630',
            padding: '10px',
          }}
        >
          <strong>NOTE!</strong> Something went wrong in the editor. You may be
          out of sync.
        </div>
      );
    }
    return;
  }

  renderDocumentId() {
    return (
      <div
        style={{
          margin: 0,
          backgroundColor: '#00B8D9',
          padding: '10px',
        }}
      >
        <div>
          <strong>DocumentId:</strong> {this.state.documentId}
        </div>
        <div>
          <strong>CollabUrl:</strong> {this.state.collabUrl}
        </div>
      </div>
    );
  }

  renderEditor() {
    const { documentId, collabUrl } = this.state;
    return (
      <div>
        {this.renderErrorFlag()}
        {this.renderDocumentId()}
        <DropzoneEditorWrapper>
          {parentContainer => (
            <EditorContext>
              <Editor
                appearance="full-page"
                analyticsHandler={analyticsHandler}
                allowStatus={true}
                allowAnalyticsGASV3={true}
                allowLayouts={true}
                allowTextColor={true}
                allowTables={{
                  advanced: true,
                  allowColumnSorting: true,
                }}
                allowTemplatePlaceholders={{ allowInserting: true }}
                media={{
                  provider: mediaProvider,
                  allowMediaSingle: true,
                  customDropzoneContainer: parentContainer,
                }}
                emojiProvider={
                  emoji.storyData.getEmojiResource() as Promise<EmojiProvider>
                }
                mentionProvider={Promise.resolve(
                  mention.storyData.resourceProviderWithResolver,
                )}
                taskDecisionProvider={Promise.resolve(
                  taskDecision.getMockTaskDecisionResource(),
                )}
                contextIdentifierProvider={storyContextIdentifierProviderFactory()}
                sanitizePrivateContent={true}
                collabEdit={{
                  useNativePlugin: true,
                  provider: Promise.resolve(
                    new Provider({
                      url: collabUrl,
                      documentAri: `ari:cloud:demo::document/${documentId}`,
                      userId,
                    }),
                  ),
                  inviteToEditHandler: this.inviteToEditHandler,
                  isInviteToEditButtonSelected: this.state
                    .isInviteToEditButtonSelected,
                }}
                placeholder="Write something..."
                shouldFocus={false}
                primaryToolbarComponents={
                  <WithEditorActions
                    render={actions => (
                      <SaveAndCancelButtons editorActions={actions} />
                    )}
                  />
                }
                allowExtension={true}
                insertMenuItems={customInsertMenuItems}
                extensionHandlers={extensionHandlers}
              />
            </EditorContext>
          )}
        </DropzoneEditorWrapper>
      </div>
    );
  }

  private handleRef = (input: HTMLInputElement) => {
    if (input) {
      if (input.name === 'documentId') {
        this.setState({
          documentIdInput: input,
        });
      }

      if (input.name === 'collabUrl') {
        this.setState({
          collabUrlInput: input,
        });
      }
    }
  };

  private onJoin = () => {
    const { documentIdInput, collabUrlInput } = this.state;
    if (documentIdInput) {
      const documentId = (documentIdInput! as HTMLInputElement).value;
      const collabUrl =
        (collabUrlInput! as HTMLInputElement).value || defaultCollabUrl;
      if (documentId) {
        try {
          history.pushState(
            {},
            '',
            `${document.location.href}&documentId=${documentId}&collabUrl=${collabUrl}`,
          );
        } catch (err) {}
        this.setState({
          documentId,
          collabUrl,
        });
      }
    }
  };

  render() {
    if (this.state.documentId) {
      return this.renderEditor();
    }

    return (
      <div>
        Document name:
        <input name="documentId" ref={this.handleRef} />
        Collab url:
        <input name="collabUrl" ref={this.handleRef} />
        <label>
          {' '}
          Default to <b>{defaultCollabUrl}</b>
        </label>
        <br />
        <button onClick={this.onJoin}>Join</button>
      </div>
    );
  }

  private inviteToEditHandler = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      isInviteToEditButtonSelected: !this.state.isInviteToEditButtonSelected,
    });
    console.log('target', event.target);
  };
}
