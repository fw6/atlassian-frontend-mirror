/* eslint-disable no-console */
import React from 'react';
import styled from 'styled-components';
import {
  Editor,
  EditorContext,
  WithEditorActions,
} from '@atlaskit/editor-core';
import { mention, taskDecision } from '@atlaskit/util-data-test';
import { BitbucketTransformer } from '../src';
import exampleBitbucketHTML from '../example-helpers/exampleHTML';
import imageUploadHandler from '../../editor-core/example-helpers/imageUpload';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';
import {
  ConfluenceCardClient,
  ConfluenceCardProvider,
} from '../../editor-core/examples/5-full-page-with-confluence-smart-cards';
const Container = styled.div`
  display: grid;
  grid-template-columns: 33% 33% 33%;
  #source,
  #output {
    border: 2px solid;
    margin: 8px;
    padding: 8px;
    white-space: pre-wrap;
    &:focus {
      outline: none;
    }
    &:empty:not(:focus)::before {
      content: attr(data-placeholder);
      font-size: 14px;
    }
  }
  #source {
    font-size: xx-small;
  }
`;

type Props = { actions: any };
type State = { source: string; output: string };

const smartCardClient = new ConfluenceCardClient('staging');

class TransformerPanels extends React.PureComponent<Props, State> {
  state: State = { source: exampleBitbucketHTML, output: '' };
  private cardProviderPromise = Promise.resolve(
    new ConfluenceCardProvider('prod'),
  );

  componentDidMount() {
    window.setTimeout(() => {
      this.props.actions.replaceDocument(this.state.source);
    });
  }

  handleUpdateToSource = (e: React.FormEvent<HTMLDivElement>) => {
    const value = e.currentTarget.innerText;
    this.setState({ source: value }, () =>
      this.props.actions.replaceDocument(value),
    );
  };

  handleChangeInTheEditor = async () => {
    const value = await this.props.actions.getValue();
    this.setState({ output: value });
  };

  render() {
    return (
      <Container>
        <div
          id="source"
          contentEditable={true}
          data-placeholder="Enter HTML to convert"
          onInput={this.handleUpdateToSource}
        >
          {exampleBitbucketHTML}
        </div>
        <SmartCardProvider client={smartCardClient}>
          <div id="editor">
            <Editor
              appearance="comment"
              allowRule={true}
              mentionProvider={Promise.resolve(
                mention.storyData.resourceProvider,
              )}
              allowTables={{ isHeaderRowRequired: true }}
              legacyImageUploadProvider={Promise.resolve(imageUploadHandler)}
              contentTransformerProvider={schema =>
                new BitbucketTransformer(schema)
              }
              taskDecisionProvider={Promise.resolve(
                taskDecision.getMockTaskDecisionResource(),
              )}
              onChange={this.handleChangeInTheEditor}
              UNSAFE_cards={{
                provider: this.cardProviderPromise,
              }}
            />
          </div>
        </SmartCardProvider>
        <div
          id="output"
          data-placeholder="This is an empty document (or something has gone really wrong)"
        >
          {this.state.output}
        </div>
      </Container>
    );
  }
}

export default () => (
  <EditorContext>
    <WithEditorActions
      render={actions => <TransformerPanels actions={actions} />}
    />
  </EditorContext>
);
