/** @jsx jsx */

import { memo } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';

import { itemWrapperStyles } from '../internal/styles';
import { EllipsisItemProps } from '../types';

const noop = () => {};

const EllipsisItem = memo((props: EllipsisItemProps) => {
  const { onClick = noop, testId } = props;

  return (
    <li css={itemWrapperStyles}>
      <Button
        appearance="subtle-link"
        spacing="none"
        testId={testId}
        onClick={onClick}
      >
        &hellip;
      </Button>
    </li>
  );
});

export default EllipsisItem;
