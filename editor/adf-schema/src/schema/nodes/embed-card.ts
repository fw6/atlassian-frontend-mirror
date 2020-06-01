import { NodeSpec, Node as PMNode } from 'prosemirror-model';

export type EmbedLayout =
  | 'wrap-right'
  | 'center'
  | 'wrap-left'
  | 'wide'
  | 'full-width'
  | 'align-end'
  | 'align-start';

export interface EmbedCardAttributes {
  /**
   * @stage 0
   * @minimum 0
   * @maximum 100
   */
  width?: number;
  originalWidth?: number;
  originalHeight?: number;
  layout: EmbedLayout;
  url: string;
}

/**
 * @name embedCard_node
 * @stage 0
 */
export interface EmbedCardDefinition {
  type: 'embedCard';
  attrs: EmbedCardAttributes;
}

export const embedCard: NodeSpec = {
  inline: false,
  group: 'block',
  selectable: true,
  attrs: {
    url: { default: '' },
    layout: { default: 'center' },
    width: { default: null },
    originalWidth: { default: null },
    originalHeight: { default: null },
  },
  parseDOM: [
    {
      tag: 'div[data-embed-card]',
      getAttrs: dom => ({
        url: (dom as HTMLElement).getAttribute('data-card-url'),
        layout: (dom as HTMLElement).getAttribute('data-layout') || 'center',
        width: Number((dom as HTMLElement).getAttribute('data-width')) || null,
        originalWidth:
          Number(
            (dom as HTMLElement).getAttribute('data-card-original-width'),
          ) || null,
        originalHeight:
          Number(
            (dom as HTMLElement).getAttribute('data-card-original-height'),
          ) || null,
      }),
    },
  ],
  toDOM(node: PMNode) {
    const { url, layout, width, originalWidth, originalHeight } = node.attrs;
    const attrs = {
      'data-embed-card': '',
      'data-card-url': url,
      'data-layout': layout,
      'data-width': width,
      'data-original-width': originalWidth,
      'data-original-height': originalHeight,
    };
    return ['div', attrs];
  },
};