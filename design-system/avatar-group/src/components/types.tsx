import { ElementType, ReactNode } from 'react';

import { AnalyticsEvent } from '@atlaskit/analytics-next';
import { AvatarPropTypes } from '@atlaskit/avatar';

import { AvatarGroupItemProps } from './AvatarGroupItem';

export type DeepRequired<T> = {
  [P in keyof T]-?: Required<T[P]>;
};

export type AvatarProps = AvatarPropTypes & {
  name: string;
  enableTooltip?: boolean;
  key?: string | number;
};

export interface AvatarGroupOverrides {
  AvatarGroupItem?: {
    render?: (
      Component: ElementType<AvatarGroupItemProps>,
      props: AvatarGroupItemProps,
      index: number,
    ) => ReactNode;
  };
  Avatar?: {
    render?: (
      Component: ElementType<AvatarProps>,
      props: AvatarProps,
      index: number,
    ) => ReactNode;
  };
}

export type onAvatarClickHandler = (
  event: React.MouseEvent,
  analyticsEvent: AnalyticsEvent | undefined,
  index: number,
) => void;
