## API Report File for "@atlaskit/editor-jira-transformer"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { Node as Node_2 } from 'prosemirror-model';
import { Schema } from 'prosemirror-model';
import { Transformer as Transformer_2 } from '@atlaskit/editor-common/types';

export declare interface ContextInfo {
  clientId: string;
  baseUrl: string;
  token: string;
  collection: string;
}

export declare type CustomEncoder = (userId: string) => string;

export declare interface JIRACustomEncoders {
  mention?: CustomEncoder;
}

export declare class JIRATransformer implements Transformer_2<string> {
  private schema;
  private customEncoders;
  private mediaContextInfo?;
  private doc;
  constructor(
    schema: Schema,
    customEncoders?: JIRACustomEncoders,
    mediaContextInfo?: MediaContextInfo,
  );
  encode(node: Node_2): string;
  parse(html: string): Node_2;
  private getContent;
  private encodeNode;
  private makeDocument;
  private encodeFragment;
  private encodeHeading;
  private encodeParagraph;
  private encodeText;
  private encodeHardBreak;
  private encodeHorizontalRule;
  private encodeBulletList;
  private encodeOrderedList;
  private encodeListItem;
  private encodeMention;
  private encodeEmoji;
  private encodeCodeBlock;
  private encodeBlockQuote;
  private encodeMediaGroup;
  private encodeMediaSingle;
  private addDataToNode;
  private buildURLWithContextInfo;
  private isImageMimeType;
  private encodeMedia;
  private encodeTable;
}

export declare interface MediaContextInfo {
  viewContext?: ContextInfo;
  uploadContext?: ContextInfo;
}

export {};
```