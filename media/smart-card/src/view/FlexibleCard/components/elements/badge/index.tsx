/** @jsx jsx */
import React from 'react';
import { MessageDescriptor } from 'react-intl-next';
import { css, jsx } from '@emotion/core';

import { BadgeProps } from './types';
import { tokens } from '../../../../../utils/token';
import { getFormattedMessage, getIconSizeStyles } from '../../utils';
import { IconType } from '../../../../../constants';
import { messages } from '../../../../../messages';
import ImageIcon from '../../common/image-icon';
import AtlaskitIcon from '../../common/atlaskit-icon';

const badgeStyles = css`
  align-items: center;
  display: flex;
  min-width: fit-content;
`;

const iconStyles = css`
  color: ${tokens.badgeIcon};
  ${getIconSizeStyles('1rem')}
  span,
  svg {
    line-height: 0;
  }
`;

const labelStyles = css`
  color: ${tokens.badgeText};
  font-size: 0.75rem;
  line-height: 1rem;
  padding-left: 0.125rem;
`;

const messageMapper: {
  [key in Partial<IconType>]?: MessageDescriptor | undefined;
} = {
  [IconType.PriorityBlocker]: messages.priority_blocker,
  [IconType.PriorityCritical]: messages.priority_critical,
  [IconType.PriorityHigh]: messages.priority_high,
  [IconType.PriorityHighest]: messages.priority_highest,
  [IconType.PriorityLow]: messages.priority_low,
  [IconType.PriorityLowest]: messages.priority_lowest,
  [IconType.PriorityMajor]: messages.priority_major,
  [IconType.PriorityMedium]: messages.priority_medium,
  [IconType.PriorityMinor]: messages.priority_minor,
  [IconType.PriorityTrivial]: messages.priority_trivial,
  [IconType.PriorityUndefined]: messages.priority_undefined,
};

const getFormattedMessageFromIcon = (
  icon?: IconType,
): React.ReactNode | string | undefined => {
  if (icon) {
    const descriptor = messageMapper[icon];
    if (descriptor) {
      return getFormattedMessage({
        descriptor,
      });
    }
  }
};

const renderAtlaskitIcon = (
  icon?: IconType,
  testId?: string,
): React.ReactNode | undefined => {
  if (icon) {
    return (
      <AtlaskitIcon
        icon={icon}
        label={icon as string}
        testId={`${testId}-icon`}
      />
    );
  }
};

const renderImageIcon = (
  url?: string,
  testId?: string,
): React.ReactNode | undefined => {
  if (url) {
    return <ImageIcon testId={testId} url={url} />;
  }
};

const Badge: React.FC<BadgeProps> = ({
  icon,
  url,
  label,
  testId = 'smart-element-badge',
}) => {
  const formattedMessageOrLabel = getFormattedMessageFromIcon(icon) || label;
  const badgeIcon =
    renderAtlaskitIcon(icon, testId) || renderImageIcon(url, testId);

  if (!formattedMessageOrLabel || !badgeIcon) {
    return null;
  }

  return (
    <div
      css={badgeStyles}
      data-fit-to-content
      data-smart-element-badge
      data-testid={testId}
    >
      <span css={iconStyles}>{badgeIcon}</span>
      <span css={labelStyles} data-testid={`${testId}-label`}>
        {formattedMessageOrLabel}
      </span>
    </div>
  );
};

export default Badge;
