/** @jsx jsx */
import {
  ElementType,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  useCallback,
  useRef,
  useState,
} from 'react';

import { jsx } from '@emotion/core';
import rafSchd from 'raf-schd';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  IS_SIDEBAR_DRAGGING,
  LEFT_SIDEBAR_WIDTH,
  MIN_LEFT_SIDEBAR_DRAG_THRESHOLD,
  RESIZE_BUTTON_SELECTOR,
  RESIZE_CONTROL_SELECTOR,
} from '../../common/constants';
import { getLeftPanelWidth } from '../../common/utils';
import { usePageLayoutResize } from '../../controllers/sidebar-resize-context';
/* import useUpdateCssVar from '../../controllers/use-update-css-vars'; */

import GrabArea from './grab-area';
import ResizeButton from './resize-button';
import { resizeControlCSS, shadowCSS } from './styles';
import { ResizeButtonProps, ResizeControlProps } from './types';

const cssSelector = { [RESIZE_CONTROL_SELECTOR]: true };
const Shadow = ({ testId }: { testId?: string }) => (
  <div data-testid={testId} css={shadowCSS} />
);

const ResizeControl = ({
  testId,
  overrides,
  resizeButtonLabel = '',
  resizeGrabAreaLabel = 'Resize',
  onResizeStart,
  onResizeEnd,
}: ResizeControlProps) => {
  const {
    expandLeftSidebar,
    collapseLeftSidebar,
    leftSidebarState,
    setLeftSidebarState,
  } = usePageLayoutResize();
  const { isLeftSidebarCollapsed, isResizing, isFlyoutOpen } = leftSidebarState;
  const x = useRef(leftSidebarState[LEFT_SIDEBAR_WIDTH]);
  // Distance of mouse from left sidebar onMouseDown
  const offset = useRef(0);
  const keyboardEventTimeout = useRef<number>();
  const [isGrabAreaFocused, setIsGrabAreaFocused] = useState(false);

  const toggleSideBar = (
    e?: ReactMouseEvent | ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (isResizing) {
      return;
    }

    if (isLeftSidebarCollapsed) {
      expandLeftSidebar();
    } else {
      collapseLeftSidebar();
    }

    // Bring focus to the resize button if the grab area is
    // "clicked" using enter/space on keyboard.
    if (e && e.nativeEvent.detail === 0) {
      const resizeButton: HTMLButtonElement | null = document.querySelector(
        `[${RESIZE_BUTTON_SELECTOR}]`,
      );
      resizeButton && resizeButton.focus();
    }
  };

  const onMouseDown = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (isLeftSidebarCollapsed) {
      return;
    }

    offset.current =
      event.clientX -
      leftSidebarState[LEFT_SIDEBAR_WIDTH] -
      getLeftPanelWidth();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.documentElement.setAttribute(IS_SIDEBAR_DRAGGING, 'true');

    setLeftSidebarState({
      ...leftSidebarState,
      isResizing: true,
    });

    onResizeStart && onResizeStart();
  };

  const cancelDrag = (shouldCollapse?: boolean) => {
    onMouseMove.cancel();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.documentElement.removeAttribute(IS_SIDEBAR_DRAGGING);
    offset.current = 0;

    collapseLeftSidebar(undefined, true);
  };

  const onMouseMove = rafSchd((event: MouseEvent) => {
    // Allow the sidebar to be 50% of the available page width
    const maxWidth = Math.round(window.innerWidth / 2);
    const leftPanelWidth = getLeftPanelWidth();
    const { leftSidebarWidth } = leftSidebarState;
    const invalidDrag = event.clientX < 0;

    if (invalidDrag) {
      cancelDrag();
    }

    const delta = Math.max(
      Math.min(
        event.clientX - leftSidebarWidth - leftPanelWidth,
        maxWidth - leftSidebarWidth - leftPanelWidth,
      ),
      COLLAPSED_LEFT_SIDEBAR_WIDTH - leftSidebarWidth - leftPanelWidth,
    );

    x.current = Math.max(
      leftSidebarWidth + delta - offset.current,
      COLLAPSED_LEFT_SIDEBAR_WIDTH,
    );

    document.documentElement.style.setProperty(
      `--${LEFT_SIDEBAR_WIDTH}`,
      `${x.current}px`,
    );
  });

  const cleanupAfterResize = () => {
    x.current = 0;
    offset.current = 0;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const onMouseUp = (event: MouseEvent) => {
    if (isLeftSidebarCollapsed) {
      return;
    }

    document.documentElement.removeAttribute(IS_SIDEBAR_DRAGGING);

    // If it is dragged to below the threshold,
    // collapse the navigation
    if (x.current < MIN_LEFT_SIDEBAR_DRAG_THRESHOLD) {
      document.documentElement.style.setProperty(
        `--${LEFT_SIDEBAR_WIDTH}`,
        `${COLLAPSED_LEFT_SIDEBAR_WIDTH}px`,
      );
      collapseLeftSidebar(undefined, true);
    }
    // If it is dragged to position in between the
    // min threshold and default width
    // expand the nav to the default width
    else if (
      x.current > MIN_LEFT_SIDEBAR_DRAG_THRESHOLD &&
      x.current < DEFAULT_LEFT_SIDEBAR_WIDTH
    ) {
      document.documentElement.style.setProperty(
        `--${LEFT_SIDEBAR_WIDTH}`,
        `${DEFAULT_LEFT_SIDEBAR_WIDTH}px`,
      );
      setLeftSidebarState({
        ...leftSidebarState,
        isResizing: false,
        [LEFT_SIDEBAR_WIDTH]: DEFAULT_LEFT_SIDEBAR_WIDTH,
        lastLeftSidebarWidth: DEFAULT_LEFT_SIDEBAR_WIDTH,
      });
    } else {
      // otherwise resize it to the desired width
      setLeftSidebarState({
        ...leftSidebarState,
        isResizing: false,
        [LEFT_SIDEBAR_WIDTH]: x.current,
        lastLeftSidebarWidth: x.current,
      });
    }

    requestAnimationFrame(() => {
      onMouseMove.cancel();
      setIsGrabAreaFocused(false);
      onResizeEnd && onResizeEnd();
      cleanupAfterResize();
    });
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (isLeftSidebarCollapsed || !isGrabAreaFocused) {
      return false;
    }

    const { key } = event;
    const isLeftOrTopArrow =
      key === 'ArrowLeft' ||
      key === 'ArrowUp' ||
      key === 'Left' ||
      key === 'Up';
    const isRightOrBottomArrow =
      key === 'ArrowRight' ||
      key === 'ArrowDown' ||
      key === 'Right' ||
      key === 'Down';

    const isSpaceOrEnter = key === 'Enter' || key === 'Spacebar' || key === ' ';
    if (isSpaceOrEnter) {
      toggleSideBar(event);
    }

    if (isLeftOrTopArrow || isRightOrBottomArrow) {
      event.preventDefault(); // prevent content scroll
      onResizeStart && onResizeStart();

      const step = 10;
      const stepValue = isLeftOrTopArrow ? -step : step;
      const { leftSidebarWidth } = leftSidebarState;
      const maxWidth = Math.round(window.innerWidth / 2) - getLeftPanelWidth();
      const hasModifierKey =
        event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
      let width = leftSidebarWidth + stepValue;

      if (width <= DEFAULT_LEFT_SIDEBAR_WIDTH) {
        width = DEFAULT_LEFT_SIDEBAR_WIDTH;
        document.documentElement.style.setProperty(
          `--${LEFT_SIDEBAR_WIDTH}`,
          `${DEFAULT_LEFT_SIDEBAR_WIDTH - 20}px`,
        );
      } else if (width > maxWidth) {
        width = maxWidth;
        document.documentElement.style.setProperty(
          `--${LEFT_SIDEBAR_WIDTH}`,
          `${maxWidth + 20}px`,
        );
      } else if (hasModifierKey) {
        width = isRightOrBottomArrow ? maxWidth : DEFAULT_LEFT_SIDEBAR_WIDTH;
      }

      // Nesting the setTimeout within requestAnimationFrame helps
      // the browser schedule the setTimeout call in an efficient manner
      requestAnimationFrame(() => {
        keyboardEventTimeout.current = window.setTimeout(() => {
          keyboardEventTimeout.current &&
            clearTimeout(keyboardEventTimeout.current);

          document.documentElement.style.setProperty(
            `--${LEFT_SIDEBAR_WIDTH}`,
            `${width}px`,
          );

          setLeftSidebarState({
            ...leftSidebarState,
            [LEFT_SIDEBAR_WIDTH]: width,
            lastLeftSidebarWidth: width,
          });
          onResizeEnd && onResizeEnd();
        }, 50);
      });
    }
  };

  const onFocus = useCallback(() => {
    setIsGrabAreaFocused(true);
  }, []);
  const onBlur = useCallback(() => {
    setIsGrabAreaFocused(false);
  }, []);

  const resizeButton = {
    render: (
      Component: ElementType<ResizeButtonProps>,
      props: ResizeButtonProps,
    ) => <Component {...props} />,
    ...(overrides && overrides.ResizeButton),
  };

  const getMaxAriaWidth = () => {
    const innerWidth = typeof window === 'undefined' ? 0 : window.innerWidth;

    return Math.round(innerWidth / 2) - getLeftPanelWidth();
  };

  /* eslint-disable jsx-a11y/role-supports-aria-props */
  return (
    <div
      {...cssSelector}
      css={resizeControlCSS(isGrabAreaFocused, isLeftSidebarCollapsed)}
    >
      <Shadow testId={testId && `${testId}-shadow`} />
      <GrabArea
        role="separator"
        aria-label={resizeGrabAreaLabel}
        aria-valuenow={leftSidebarState.leftSidebarWidth}
        aria-valuemin={DEFAULT_LEFT_SIDEBAR_WIDTH}
        aria-valuemax={getMaxAriaWidth()}
        aria-expanded={!isLeftSidebarCollapsed}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        onFocus={onFocus}
        onBlur={onBlur}
        testId={testId && `${testId}-grab-area`}
        isLeftSidebarCollapsed={isLeftSidebarCollapsed}
        disabled={isLeftSidebarCollapsed && !isFlyoutOpen}
      />
      {resizeButton.render(ResizeButton, {
        isLeftSidebarCollapsed,
        label: resizeButtonLabel,
        onClick: toggleSideBar,
        testId: testId && `${testId}-resize-button`,
      })}
    </div>
  );
  /* eslint-enable jsx-a11y/role-supports-aria-props */
};

export default ResizeControl;
