import React, { FC, Fragment, ReactNode } from 'react';

import {
  background,
  G300,
  N200,
  N40,
  purple,
  R300,
} from '@atlaskit/theme/colors';

import { ICON_OFFSET, ICON_SIZES } from './constants';
import IconWrapper from './IconWrapper';
import { AppearanceType, IndicatorSizeType } from './types';

export type PresenceType = 'busy' | 'focus' | 'offline' | 'online' | ReactNode;

export interface PresenceProps {
  /** Used to override the default border color of the presence indicator.
   Accepts any color argument that the border-color CSS property accepts. */
  borderColor?: string;
  /** Content to use as a custom presence indicator (usually not required if
   consuming Presence separate to Avatar). */
  children?: ReactNode;
  /** The type of presence indicator to show */
  presence?: PresenceType;
  /** Test Id */
  testId?: string;
}

const BusyIndicator = (
  <Fragment>
    <circle fill={R300} cx="4" cy="4" r="4" />
    <path
      fill={background()}
      d="M3.3,1.9l2.8,2.8c0.2,0.2,0.2,0.5,0,0.7L5.4,6.1c-0.2,0.2-0.5,0.2-0.7,0L1.9,3.3c-0.2-0.2-0.2-0.5,0-0.7l0.7-0.7C2.8,1.7,3.1,1.7,3.3,1.9z"
    />
  </Fragment>
);

const FocusIndicator = (
  <path
    fill={purple()}
    d="M4,8 C1.790861,8 0,6.209139 0,4 C0,1.790861 1.790861,0 4,0 C6.209139,0 8,1.790861 8,4 C8,6.209139 6.209139,8 4,8 Z M4,6.66666667 C5.47275933,6.66666667 6.66666667,5.47275933 6.66666667,4 C6.66666667,2.52724067 5.47275933,1.33333333 4,1.33333333 C2.52724067,1.33333333 1.33333333,2.52724067 1.33333333,4 C1.33333333,5.47275933 2.52724067,6.66666667 4,6.66666667 Z M4,5.33333333 C3.26362033,5.33333333 2.66666667,4.73637967 2.66666667,4 C2.66666667,3.26362033 3.26362033,2.66666667 4,2.66666667 C4.73637967,2.66666667 5.33333333,3.26362033 5.33333333,4 C5.33333333,4.73637967 4.73637967,5.33333333 4,5.33333333 Z"
  />
);

const OfflineIndicator = (
  <Fragment>
    <path
      fill={N200}
      d="M4,8 C6.209139,8 8,6.209139 8,4 C8,1.790861 6.209139,0 4,0 C1.790861,0 0,1.790861 0,4 C0,6.209139 1.790861,8 4,8 Z M4,6 C5.1045695,6 6,5.1045695 6,4 C6,2.8954305 5.1045695,2 4,2 C2.8954305,2 2,2.8954305 2,4 C2,5.1045695 2.8954305,6 4,6 Z"
    />
    <path
      fill={N40}
      d="M4,6 C5.1045695,6 6,5.1045695 6,4 C6,2.8954305 5.1045695,2 4,2 C2.8954305,2 2,2.8954305 2,4 C2,5.1045695 2.8954305,6 4,6 Z"
    />
  </Fragment>
);

const OnlineIndicator = <circle fill={G300} cx="4" cy="4" r="4" />;

function getPresence(presence: PresenceType) {
  switch (presence) {
    case 'busy':
      return BusyIndicator;
    case 'focus':
      return FocusIndicator;
    case 'offline':
      return OfflineIndicator;
    case 'online':
      return OnlineIndicator;
  }
}

const Presence: FC<PresenceProps> = ({ borderColor, children, presence }) => (
  <IconWrapper bgColor={borderColor}>
    {presence ? (
      <svg
        height="100%"
        version="1.1"
        viewBox="0 0 8 8"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        {getPresence(presence)}
      </svg>
    ) : (
      children
    )}
  </IconWrapper>
);

export default Presence;

export interface PresenceWrapperProps extends PresenceProps {
  appearance: AppearanceType;
  size: IndicatorSizeType;
  testId?: string;
}

export const PresenceWrapper: FC<PresenceWrapperProps> = ({
  size,
  appearance,
  children,
  borderColor,
  presence,
  testId,
}) => {
  const position = appearance === 'square' ? -4 : ICON_OFFSET[size];

  return (
    <span
      data-testid={testId && `${testId}--presence`}
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        bottom: `${position}px`,
        height: `${ICON_SIZES[size]}px`,
        right: `${position}px`,
        width: `${ICON_SIZES[size]}px`,
      }}
    >
      <Presence borderColor={borderColor} presence={!children && presence}>
        {children}
      </Presence>
    </span>
  );
};