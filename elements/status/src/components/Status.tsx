/** @jsx jsx */
import { PureComponent, MouseEvent } from 'react';
import { css, jsx } from '@emotion/react';
import Lozenge, { ThemeAppearance } from '@atlaskit/lozenge';
import {
  WithAnalyticsEventsProps,
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { createStatusAnalyticsAndFire } from './analytics';
import { ANALYTICS_HOVER_DELAY } from './constants';

export type Color = 'neutral' | 'purple' | 'blue' | 'red' | 'yellow' | 'green';
export type StatusStyle = 'bold' | 'subtle';

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
const colorToLozengeAppearanceMap: { [K in Color]: ThemeAppearance } = {
  neutral: 'default',
  purple: 'new',
  blue: 'inprogress',
  red: 'removed',
  yellow: 'moved',
  green: 'success',
};
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

const DEFAULT_APPEARANCE = 'default';
const MAX_WIDTH = 200;

/**
 * This is to account for a bug in android chromium and should be removed
 * when the editor fixes its focus handling with respect to Status.
 *
 * See DSP-7701 for additional context.
 */
const inlineBlockStyles = css({
  '& > *': {
    display: 'inline-block !important',
    lineHeight: '16px',
  },
});

// eg. Version/4.0 Chrome/95.0.4638.50
const isAndroidChromium =
  typeof window !== 'undefined' &&
  /Version\/.* Chrome\/.*/.test(window.navigator.userAgent);

export interface OwnProps {
  text: string;
  color: Color;
  style?: StatusStyle;
  localId?: string;
  onClick?: (event: React.SyntheticEvent<any>) => void;
  onHover?: () => void;
  role?: string;
}

export type Props = OwnProps & WithAnalyticsEventsProps;

class StatusInternal extends PureComponent<Props, any> {
  static displayName = 'StatusInternal';

  private hoverStartTime: number = 0;

  private handleMouseEnter = (_e: MouseEvent<HTMLSpanElement>) => {
    this.hoverStartTime = Date.now();
  };

  private handleMouseLeave = (_e: MouseEvent<HTMLSpanElement>) => {
    const { onHover } = this.props;
    const delay = Date.now() - this.hoverStartTime;

    if (delay >= ANALYTICS_HOVER_DELAY && onHover) {
      onHover();
    }
    this.hoverStartTime = 0;
  };

  componentWillUnmount() {
    this.hoverStartTime = 0;
  }

  render() {
    const { text, color, style, role, onClick } = this.props;
    if (text.trim().length === 0) {
      return null;
    }

    const appearance = colorToLozengeAppearanceMap[color] || DEFAULT_APPEARANCE;
    // Note: ommitted data-local-id attribute to avoid copying/pasting the same localId
    return (
      <span
        css={isAndroidChromium ? inlineBlockStyles : undefined}
        className="status-lozenge-span"
        onClick={onClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        data-node-type="status"
        data-color={color}
        data-style={style}
        role={role}
      >
        <Lozenge appearance={appearance} maxWidth={MAX_WIDTH}>
          {text}
        </Lozenge>
      </span>
    );
  }
}

export const Status = withAnalyticsEvents({
  onClick: (
    createEvent: CreateUIAnalyticsEvent,
    props: Props,
  ): UIAnalyticsEvent => {
    const { localId } = props;
    return createStatusAnalyticsAndFire(createEvent)({
      action: 'clicked',
      actionSubject: 'statusLozenge',
      attributes: {
        localId,
      },
    });
  },
  onHover: (
    createEvent: CreateUIAnalyticsEvent,
    props: Props,
  ): UIAnalyticsEvent => {
    const { localId } = props;
    return createStatusAnalyticsAndFire(createEvent)({
      action: 'hovered',
      actionSubject: 'statusLozenge',
      attributes: {
        localId,
      },
    });
  },
})(StatusInternal);
