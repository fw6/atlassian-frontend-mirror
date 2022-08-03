## API Report File for "@atlaskit/editor-bitbucket-transformer"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { Node as Node_2 } from 'prosemirror-model';
import { Schema } from 'prosemirror-model';
import { Transformer as Transformer_2 } from '@atlaskit/editor-common/types';

export declare class BitbucketTransformer implements Transformer_2<string> {
  private serializer;
  private schema;
  private options;
  constructor(schema: Schema, options?: TransformerOptions);
  encode(node: Node_2): string;
  parse(html: string): Node_2;
  buildDOMTree(html: string): HTMLElement;
}

export declare interface TransformerOptions {
  disableBitbucketLinkStripping?: boolean;
}

export {};
```