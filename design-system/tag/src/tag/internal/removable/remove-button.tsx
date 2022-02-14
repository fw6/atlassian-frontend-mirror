/** @jsx jsx */
import {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';

import { css, jsx } from '@emotion/core';

import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { cssVar } from '../../../constants';

type RemoveButtonProps = {
  'aria-label'?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onKeyPress?: KeyboardEventHandler<HTMLButtonElement>;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: MouseEventHandler<HTMLButtonElement>;
  testId?: string;
};

const baseStyles = css({
  display: 'flex',
  height: '16px',
  margin: 0,
  padding: 0,
  position: 'absolute',
  right: 0,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  appearance: 'none',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: `var(${cssVar.borderRadius})`,
  color: token('color.text', N500),
  cursor: 'pointer',
  pointerEvents: 'auto',
  '&::-moz-focus-inner': {
    margin: 0,
    padding: 0,
    border: 0,
  },
  ':hover': {
    color: `var(${cssVar.color.text.default})`,
  },
});

const focusRingStyles = css({
  '&:focus': {
    boxShadow: `0 0 0 2px var(${cssVar.color.focusRing}) inset`,
    outline: 'none',
  },
});

const RemoveButton = ({
  'aria-label': ariaLabel,
  onClick,
  onFocus,
  onBlur,
  onKeyPress,
  onMouseOver,
  onMouseOut,
  testId,
}: RemoveButtonProps) => {
  return (
    <button
      css={[baseStyles, focusRingStyles]}
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyPress={onKeyPress}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      type="button"
      data-testid={testId}
    >
      <EditorCloseIcon label="close tag" size="small" />
    </button>
  );
};

export default RemoveButton;
