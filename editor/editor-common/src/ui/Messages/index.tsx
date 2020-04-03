import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { h200 } from '@atlaskit/theme/typography';
import { multiply } from '@atlaskit/theme/math';
import { R400, G400, N200 } from '@atlaskit/theme/colors';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';

const Message = styled.div<{ error?: boolean; valid?: boolean }>`
  ${h200} font-weight: normal;
  color: ${props => {
    if (props.error) {
      return R400;
    }
    if (props.valid) {
      return G400;
    }
    return N200;
  }};
  margin-top: ${multiply(gridSize, 0.5)}px;
  display: flex;
  justify-content: baseline;
`;

const IconWrapper = styled.span`
  display: flex;
  margin-right: 4px;
`;

interface Props {
  /** The content of the message */
  children: ReactNode;
}

export const HelperMessage = ({ children }: Props) => (
  <Message>{children}</Message>
);

export const ErrorMessage = ({ children }: Props) => (
  <Message error>
    <IconWrapper>
      <ErrorIcon size="small" label="error" aria-label="error" />
    </IconWrapper>
    {children}
  </Message>
);

export const ValidMessage = ({ children }: Props) => (
  <Message valid>
    <IconWrapper>
      <SuccessIcon size="small" label="success" />
    </IconWrapper>
    {children}
  </Message>
);
