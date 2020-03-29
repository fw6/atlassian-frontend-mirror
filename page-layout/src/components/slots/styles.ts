import { CSSObject, css } from '@emotion/core';
import { easeOut, prefersReducedMotion } from '@atlaskit/motion';

import {
  LEFT_PANEL,
  BANNER,
  RIGHT_PANEL,
  TOP_NAVIGATION,
  CONTENT,
  LEFT_PANEL_WIDTH,
  RIGHT_PANEL_WIDTH,
  BANNER_HEIGHT,
  TOP_NAVIGATION_HEIGHT,
  LEFT_SIDEBAR_FLYOUT,
  LEFT_SIDEBAR_WIDTH,
  RIGHT_SIDEBAR_WIDTH,
  IS_SIDEBAR_DRAGGING,
  IS_FLYOUT_OPEN,
  RESIZE_BUTTON_SELECTOR,
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  MAIN_SELECTOR,
} from '../../common/constants';

const gridTemplateAreas = `
  "${LEFT_PANEL} ${BANNER} ${RIGHT_PANEL}"
  "${LEFT_PANEL} ${TOP_NAVIGATION} ${RIGHT_PANEL}"
  "${LEFT_PANEL} ${CONTENT} ${RIGHT_PANEL}"
 `;
export const gridStyles = css`
  /* IE11 */
  display: -ms-grid;
  // prettier-ignore
  -ms-grid-columns: var(--${LEFT_PANEL_WIDTH}) var(--${LEFT_SIDEBAR_WIDTH}) 1fr var(--${RIGHT_SIDEBAR_WIDTH}) var(--${RIGHT_PANEL_WIDTH});
  -ms-grid-rows: var(--${BANNER_HEIGHT}) var(--${TOP_NAVIGATION_HEIGHT}) 1fr;
  /* IE11 */

  display: grid;
  height: 100%;
  // prettier-ignore
  grid-template-columns: var(--${LEFT_PANEL_WIDTH}) minmax(0, 1fr) var(--${RIGHT_PANEL_WIDTH});
  grid-template-rows: var(--${BANNER_HEIGHT}) var(--${TOP_NAVIGATION_HEIGHT})
    auto;
  grid-template-areas: ${gridTemplateAreas};
`;

export const contentStyles = css`
  /* IE11 */
  -ms-grid-column: 2;
  -ms-grid-column-span: 3;
  -ms-grid-row: 3;
  -ms-grid-row-span: 3;
  /* IE11 */

  grid-area: ${CONTENT};
  display: flex;
  height: 100%;
  position: relative;
`;

export const bannerStyles = (isFixed?: boolean): CSSObject => ({
  gridArea: `${BANNER}`,
  height: `var(--${BANNER_HEIGHT})`,

  ...(isFixed && {
    position: 'fixed',
    top: 0,
    left: `var(--${LEFT_PANEL_WIDTH})`,
    right: `var(--${RIGHT_PANEL_WIDTH})`,
    zIndex: 2,
  }),

  // /* IE11 */
  msGridColumn: '2',
  msGridColumnSpan: '3',
  msGridRow: '1',
  // /* IE11 */
});

export const topNavigationStyles = (isFixed?: boolean): CSSObject => ({
  gridArea: `${TOP_NAVIGATION}`,
  height: `var(--${TOP_NAVIGATION_HEIGHT})`,

  ...(isFixed && {
    position: 'fixed',
    top: `var(--${BANNER_HEIGHT})`,
    left: `var(--${LEFT_PANEL_WIDTH})`,
    right: `var(--${RIGHT_PANEL_WIDTH})`,
    zIndex: 2,
  }),

  // /* IE11 */
  msGridColumn: '2',
  msGridColumnSpan: '3',
  msGridRow: '2',
  // /* IE11 */
});

// This inner wrapper is required to allow the
// sidebar to be position: fixed. If we were to apply position: fixed
// to the outer wrapper, it will be popped out of it's flex container
// and Main would stretch to occupy all the space.
export const fixedLeftSidebarInnerStyles = (isFixed?: boolean): CSSObject => ({
  ...(isFixed
    ? {
        position: 'fixed',
        top: `calc(var(--${BANNER_HEIGHT}) + var(--${TOP_NAVIGATION_HEIGHT}))`,
        left: `calc(var(--${LEFT_PANEL_WIDTH}))`,
        bottom: 0,
        width: `var(--${LEFT_SIDEBAR_WIDTH})`,
        transition: `width 300ms ${easeOut} 0s`,

        [`[${IS_SIDEBAR_DRAGGING}] &`]: {
          // Make sure drag to resize does not animate as the user drags
          transition: 'none',
          cursor: 'ew-resize',
        },

        [`[${IS_FLYOUT_OPEN}] &`]: {
          width: `var(--${LEFT_SIDEBAR_FLYOUT})`,
        },

        ...prefersReducedMotion(),
      }
    : {
        height: '100%',
      }),
});

export const leftSidebarStyles = (isFixed?: boolean): CSSObject => ({
  position: 'relative',
  width: `var(--${LEFT_SIDEBAR_WIDTH})`,
  transition: `width 300ms ${easeOut} 0s`,
  zIndex: 1, // Make resize affordance appear on top of content
  marginLeft: 0,

  [`[${IS_SIDEBAR_DRAGGING}] &`]: {
    // Make sure drag to resize does not animate as the user drags
    transition: 'none',
    cursor: 'ew-resize',
  },

  [`&:hover [${RESIZE_BUTTON_SELECTOR}]`]: {
    opacity: 1,
  },

  [`[${IS_FLYOUT_OPEN}] &`]: {
    width: `var(--${LEFT_SIDEBAR_FLYOUT})`,

    [`& + [${MAIN_SELECTOR}]`]: {
      // adds a negative left margin to main
      // which transitions at the same speed
      // with which left sidebars width increases
      // This give an illusion that the flyout is appearing
      // on top of the main content, while main remains in place
      marginLeft: `calc(-1 * var(--${LEFT_SIDEBAR_FLYOUT}) + ${COLLAPSED_LEFT_SIDEBAR_WIDTH}px)`,
    },

    ...prefersReducedMotion(),
  },

  ...(isFixed && {
    // in fixed mode this element's child is taken out of the document flow
    // It doesn't take up the width as expected
    // psuedo element forces it to take up the necessary width
    '&::after': {
      content: "''",
      display: 'inline-block',
      width: `var(--${LEFT_SIDEBAR_WIDTH})`,
    },

    [`[${IS_FLYOUT_OPEN}] &`]: {
      // Keep the flex child collapsed so Main
      // stays in position. Flyout behaviour for
      // left sidebar in fixed mode is handled
      // by the fixed child of this element.
      width: COLLAPSED_LEFT_SIDEBAR_WIDTH,
    },
  }),
});

export const mainStyles: CSSObject = {
  flexGrow: 1,
  // Prevent flex container from blowing
  // up when there's super wide content
  overflow: 'auto',
  // Transition negative margin on main
  // in sync with the increase in width of
  // leftSidebar
  transition: `margin-left 300ms ${easeOut} 0s`,
  marginLeft: 0,

  [`[${IS_SIDEBAR_DRAGGING}] &`]: {
    // Make sure drag to resize remains snappy
    transition: 'none',
    cursor: 'ew-resize',
  },

  ...prefersReducedMotion(),
};

// This inner wrapper is required to allow the
// sidebar to be position: fixed. If we were to apply position: fixed
// to the outer wrapper, it will be popped out of it's flex container
// and Main would stretch to occupy all the space.
export const fixedRightSidebarInnerStyles = (isFixed?: boolean): CSSObject => ({
  ...(isFixed
    ? {
        position: 'fixed',
        top: `calc(var(--${BANNER_HEIGHT}) + var(--${TOP_NAVIGATION_HEIGHT}))`,
        right: `calc(var(--${RIGHT_PANEL_WIDTH}))`,
        bottom: 0,
      }
    : { height: '100%' }),
});
export const rightSidebarStyles = (isFixed?: boolean): CSSObject => ({
  width: `var(--${RIGHT_SIDEBAR_WIDTH})`,

  ...(isFixed && {
    // in fixed mode this element's child is taken out of the document flow
    // It doesn't take up the width as expected
    // psuedo element forces it to take up the necessary width
    '&::after': {
      content: "''",
      display: 'inline-block',
      width: `var(--${LEFT_SIDEBAR_WIDTH})`,
    },
  }),
});

export const rightPanelStyles = (isFixed?: boolean): CSSObject => ({
  gridArea: RIGHT_PANEL,

  ...(isFixed && {
    position: 'fixed',
    width: `var(--${RIGHT_PANEL_WIDTH})`,
    top: 0,
    bottom: 0,
    right: 0,
  }),

  /* IE11 */
  msGridColumn: '5',
  msGridRow: '1',
  msGridRowSpan: '3',
  /* IE11 */
});

export const leftPanelStyles = (isFixed?: boolean): CSSObject => ({
  gridArea: LEFT_PANEL,

  ...(isFixed && {
    position: 'fixed',
    width: `var(--${LEFT_PANEL_WIDTH})`,
    top: 0,
    bottom: 0,
    left: 0,
  }),

  /* IE11 */
  msGridColumn: '1',
  msGridRow: '1',
  msGridRowSpan: '3',
  /* IE11 */
});
