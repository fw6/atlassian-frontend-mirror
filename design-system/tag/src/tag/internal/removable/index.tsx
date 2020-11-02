/** @jsx jsx */
import { forwardRef, memo, useCallback, useMemo, useState } from 'react';

import { jsx } from '@emotion/core';

import {
  useCallbackWithAnalytics,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import { ExitingPersistence, ShrinkOut } from '@atlaskit/motion';
import GlobalTheme from '@atlaskit/theme/components';
import { GlobalThemeTokens, ThemeModes } from '@atlaskit/theme/types';

import { getThemeColors } from '../../../theme';
// eslint-disable-next-line import/order
import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';

export interface RemovableTagProps
  extends SimpleTagProps,
    WithAnalyticsEventsProps {
  /** Text render as the aria-label for remove button. */
  removeButtonLabel?: string;
  /** Flag to indicate if a tag is removeable. */
  isRemovable?: boolean;
  /** Handler to be called before the tag is removed. If it does not return a
   truthy value, the tag will not be removed. */
  onBeforeRemoveAction?: () => boolean;
  /** Handler to be called after tag is removed. Called with the string 'Post
   Removal Hook'. */
  onAfterRemoveAction?: (text: string) => void;
}

import BaseTag from '../shared/base';
import Before from '../shared/before';
import Content from '../shared/content';
import {
  chromeLinkStyles,
  chromeStyles,
  roundedBorderStyles,
} from '../shared/styles';
import { SimpleTagProps } from '../shared/types';
import { mergeRefs } from '../shared/utils';

import { removeButtonStyles } from './styles';

interface ThemedRemovableTagProps extends RemovableTagProps {
  mode: ThemeModes;
}

const defaultBeforeRemoveAction = () => true;
const noop = () => {};

enum TagStatus {
  Showing = 'showing',
  Removing = 'removing',
  Removed = 'removed',
}

const InnerRemovableTag = forwardRef(
  (props: ThemedRemovableTagProps, ref: React.Ref<any>) => {
    const [status, setStatus] = useState<TagStatus>(TagStatus.Showing);

    const {
      appearance = 'default',
      elemBefore = null,
      isRemovable = true,
      text = '',
      color = 'standard',
      mode = 'light',
      href,
      removeButtonLabel,
      testId,
      onBeforeRemoveAction = defaultBeforeRemoveAction,
      onAfterRemoveAction = noop,
    } = props;

    const isRounded = appearance === 'rounded';
    const isLink = Boolean(href);

    const onAfterRemoveActionWithAnalytics = useCallbackWithAnalytics(
      onAfterRemoveAction,
      {
        action: 'removed',
        actionSubject: 'tag',
        attributes: {
          componentName: 'tag',
          packageName,
          packageVersion,
        },
      },
      'atlaskit',
    );

    const handleRemoveComplete = useCallback(() => {
      onAfterRemoveActionWithAnalytics(text);
      setStatus(TagStatus.Removed);
    }, [onAfterRemoveActionWithAnalytics, text]);

    const handleRemoveRequest = useCallback(() => {
      if (onBeforeRemoveAction && onBeforeRemoveAction()) {
        handleRemoveComplete();
      }
    }, [handleRemoveComplete, onBeforeRemoveAction]);

    const onKeyPress = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        const spacebarOrEnter = e.key === ' ' || e.key === 'Enter';

        if (spacebarOrEnter) {
          e.stopPropagation();
          handleRemoveRequest();
        }
      },
      [handleRemoveRequest],
    );

    const removingTag = useCallback(() => setStatus(TagStatus.Removing), []);

    const showingTag = useCallback(() => setStatus(TagStatus.Showing), []);

    const {
      chromeColors,
      chromeLinkColors,
      buttonColors,
      linkHoverColor,
    } = useMemo(() => getThemeColors(color, mode), [color, mode]);

    const chromeContainerForLinkStyles = [
      chromeLinkStyles(chromeLinkColors),
      isRounded ? roundedBorderStyles : undefined,
    ];

    const chromeContainerStyles = [
      chromeStyles({
        ...chromeColors,
      }),
      isRounded ? roundedBorderStyles : undefined,
    ];

    const removeButton = isRemovable ? (
      <button
        css={[
          removeButtonStyles({
            ...buttonColors,
          }),
          isRounded ? roundedBorderStyles : undefined,
        ]}
        tabIndex={0}
        aria-label={removeButtonLabel}
        onClick={handleRemoveRequest}
        onFocus={removingTag}
        onBlur={showingTag}
        onKeyPress={onKeyPress}
        type="button"
        data-testid={`close-button-${testId}`}
      >
        <EditorCloseIcon label="close tag" size="small" />
      </button>
    ) : undefined;

    const tagCss = [
      ...chromeContainerStyles,
      isLink ? chromeContainerForLinkStyles : undefined,
    ];

    const content = (
      <Content
        {...props}
        isRemovable={isRemovable}
        isLink={isLink}
        isRounded={isRounded}
        linkHoverColor={linkHoverColor}
      />
    );

    return (
      <ExitingPersistence>
        {!(status === TagStatus.Removed) && (
          <ShrinkOut>
            {motion => {
              return (
                <BaseTag
                  ref={mergeRefs(motion.ref, ref)}
                  testId={testId}
                  tagCss={tagCss}
                  data-removable
                  data-removing={status === TagStatus.Removing}
                  role={isLink ? 'link' : undefined}
                  before={
                    <Before isRounded={isRounded} elemBefore={elemBefore} />
                  }
                  contentElement={content}
                  after={removeButton}
                />
              );
            }}
          </ShrinkOut>
        )}
      </ExitingPersistence>
    );
  },
);

const RemovableTag = memo(
  forwardRef((props: RemovableTagProps, ref: React.Ref<any>) => {
    return (
      <GlobalTheme.Consumer>
        {(tokens: GlobalThemeTokens) => {
          return <InnerRemovableTag {...props} mode={tokens.mode} ref={ref} />;
        }}
      </GlobalTheme.Consumer>
    );
  }),
);

export default RemovableTag;
