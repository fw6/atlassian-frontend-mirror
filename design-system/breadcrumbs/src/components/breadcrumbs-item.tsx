/** @jsx jsx */

import { ComponentType, CSSProperties, memo, useRef } from 'react';

import { css, jsx } from '@emotion/core';
import { lazyForPaint, LazySuspense } from 'react-loosely-lazy';

import { fontSize, gridSize } from '@atlaskit/theme/constants';
import type { TooltipProps } from '@atlaskit/tooltip';

import { BreadcrumbsItemProps } from '../types';

import Step from './internal/step';
import useOverflowable from './internal/use-overflowable';

const gridSizeUnit = gridSize();
const height = (gridSize() * 3) / fontSize();

const AKTooltip = lazyForPaint(
  () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_Tooltip" */ '@atlaskit/tooltip'
    ),
  { ssr: false },
) as ComponentType<TooltipProps>;

const itemWrapperStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  maxWidth: '100%',
  height: `${height}em`,
  margin: 0,
  padding: 0,
  flexDirection: 'row',
  lineHeight: `${height}em`,
  '&:not(:last-child)::after': {
    width: gridSizeUnit,
    padding: `0 ${gridSizeUnit}px`,
    flexShrink: 0,
    content: '"/"',
    textAlign: 'center',
  },
});

const VAR_STEP_TRUNCATION_WIDTH = '--max-width';

const staticItemWithTruncationStyles = css({
  maxWidth: `var(${VAR_STEP_TRUNCATION_WIDTH})`,
  fontWeight: 400,
});

const staticItemWithoutTruncationStyles = css({
  minWidth: 0,
  flexShrink: 1,
  fontWeight: 400,
});

const BreadcrumbsItem = memo((props: BreadcrumbsItemProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { truncationWidth, text, ...restButtonProps } = props;

  const showTooltip = useOverflowable(truncationWidth, buttonRef);
  const buttonProps = {
    ...restButtonProps,
    ref: buttonRef,
    hasOverflow: showTooltip,
  };

  // Note: cast to `any` is required to type verification - see https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
  const dynamicItemStyles: CSSProperties = {
    [VAR_STEP_TRUNCATION_WIDTH as any]: `${truncationWidth}px`,
  };

  const step = (
    <Step
      {...buttonProps}
      css={
        truncationWidth
          ? staticItemWithTruncationStyles
          : staticItemWithoutTruncationStyles
      }
      style={dynamicItemStyles}
    >
      {text}
    </Step>
  );
  return (
    <li css={itemWrapperStyles}>
      {showTooltip ? (
        /* The div exists because of tooltip */
        <LazySuspense fallback={<div>{step}</div>}>
          <AKTooltip content={text} position="bottom">
            {step}
          </AKTooltip>
        </LazySuspense>
      ) : (
        step
      )}
    </li>
  );
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default BreadcrumbsItem;
