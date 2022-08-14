/** @jsx jsx */
import { forwardRef, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { GlobalSpacingToken, SPACING_SCALE } from '../constants';

import { BasePrimitiveProps } from './types';

interface StackProps extends BasePrimitiveProps {
  /**
   * Used to align children along the cross axis.
   */
  alignItems?: FlexAlignItems;
  /**
   * Used to align children along the main axis.
   */
  justifyContent?: FlexJustifyContent;
  /**
   * Token representing gap between children.
   */
  gap: GlobalSpacingToken;
  /**
   * Elements to be rendered inside the Stack.
   */
  children: ReactNode;
}

type FlexAlignItems = keyof typeof flexAlignItemsMap;
const flexAlignItemsMap = {
  center: css({ alignItems: 'center' }),
  baseline: css({ alignItems: 'baseline' }),
  flexStart: css({ alignItems: 'flex-start' }),
  flexEnd: css({ alignItems: 'flex-end' }),
};

type FlexJustifyContent = keyof typeof flexJustifyContentMap;
const flexJustifyContentMap = {
  center: css({ justifyContent: 'center' }),
  flexStart: css({ justifyContent: 'flex-start' }),
  flexEnd: css({ justifyContent: 'flex-end' }),
};

const baseStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  flexDirection: 'column',
});

/**
 * __Stack__
 *
 * Stack is a primitive component based on flexbox that manages the vertical layout of direct children.
 * Renders a `div` by default.
 *
 */
const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ gap, alignItems, justifyContent, children, testId }, ref) => {
    return (
      <div
        css={[
          baseStyles,
          gap && gapMap[gap],
          alignItems && flexAlignItemsMap[alignItems],
          justifyContent && flexJustifyContentMap[justifyContent],
        ]}
        data-testid={testId}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

export default Stack;

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ac3192fbc453a94ab5e720d0273556ef>>
 * @codegenId spacing
 * @codegenCommand yarn codegen-styles
 * @codegenParams ["gap"]
 */
const gapMap = {
  'sp-0': css({ gap: SPACING_SCALE['sp-0'] }),
  'sp-25': css({ gap: SPACING_SCALE['sp-25'] }),
  'sp-50': css({ gap: SPACING_SCALE['sp-50'] }),
  'sp-75': css({ gap: SPACING_SCALE['sp-75'] }),
  'sp-100': css({ gap: SPACING_SCALE['sp-100'] }),
  'sp-200': css({ gap: SPACING_SCALE['sp-200'] }),
  'sp-300': css({ gap: SPACING_SCALE['sp-300'] }),
  'sp-400': css({ gap: SPACING_SCALE['sp-400'] }),
  'sp-500': css({ gap: SPACING_SCALE['sp-500'] }),
  'sp-600': css({ gap: SPACING_SCALE['sp-600'] }),
  'sp-800': css({ gap: SPACING_SCALE['sp-800'] }),
};

/**
 * @codegenEnd
 */