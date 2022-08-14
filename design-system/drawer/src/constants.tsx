import { easeOut } from '@atlaskit/motion/curves';

import type { DrawerWidth } from './components/types';

export const transitionDuration = '0.22s';
export const transitionDurationMs = 220;
export const transitionTimingFunction = easeOut;
export const widths: DrawerWidth[] = [
  'narrow',
  'medium',
  'wide',
  'extended',
  'full',
];

export const animationTimingFunction = () => easeOut;