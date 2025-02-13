/** @jsx jsx */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';
import { UIAnalyticsEvent, useAnalyticsEvents } from '@atlaskit/analytics-next';
import {
  KeyboardOrMouseEvent,
  ModalTransition,
  OnCloseHandler,
} from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { Analytics, UFO } from '../../analytics';
import {
  onDialogSelectReactionChange,
  ReactionStatus,
  ReactionClick,
  ReactionSummary,
  ReactionSource,
  QuickReactionEmojiSummary,
} from '../../types';
import { i18n } from '../../shared';
import { Reaction, ReactionProps } from '../Reaction';
import { ReactionsDialog } from '../ReactionDialog';
import { ReactionPicker, ReactionPickerProps } from '../ReactionPicker';
import { SelectorProps } from '../Selector';
import * as styles from './styles';

/**
 * Set of all available UFO experiences relating to reactions dialog
 */
export const ufoExperiences = {
  /**
   * Expeirence when a reaction dialog is opened
   */
  openDialog: UFO.ReactionDialogOpened,
  /**
   * Experience when a reaction dialog is closed
   */
  closeDialog: UFO.ReactionDialogClosed,
  /**
   * Experience when a reaction changed/fetched from inside the modal dialog
   */
  selectedReactionChangeInsideDialog: UFO.ReactionDialogSelectedReactionChanged,
};

/**
 * Test id for wrapper Reactions div
 */
export const RENDER_REACTIONS_TESTID = 'render-reactions';
/**
 * Test id for the view all reacted user to trigger the dialog
 */
export const RENDER_VIEWALL_REACTED_USERS_DIALOG =
  'viewall-reacted-users-dialog';

export interface ReactionsProps
  extends Pick<
      ReactionPickerProps,
      'allowAllEmojis' | 'emojiProvider' | 'emojiPickerSize' | 'miniMode'
    >,
    Pick<SelectorProps, 'pickerQuickReactionEmojiIds'>,
    Pick<ReactionProps, 'allowUserDialog'> {
  /**
   * event handler to fetching the reactions
   */
  loadReaction: () => void;
  /**
   * Event callback when an emoji button is selected
   */
  onSelection: (emojiId: string) => void;
  /**
   * Optional list of reactions to render (defaults to empty list)
   */
  reactions?: ReactionSummary[];
  /**
   * Condition for the reaction list status while being fetched
   */
  status: ReactionStatus;
  /**
   * event handler when the emoji button is clicked
   */
  onReactionClick: ReactionClick;
  /**
   * Optional emoji reactions list to show custom animation or render as standard (key => emoji string "id", value => true/false to show custom animation)
   */
  flash?: Record<string, boolean>;
  /**
   * Optional event to get reaction details for an emoji
   * @param emojiId current reaction emoji id
   */
  getReactionDetails?: (emojiId: string) => void;
  /**
   * @deprecated use getReactionDetails instead
   */
  onReactionHover?: (emojiId: string) => void;
  /**
   * Optional error message to show when unable to display the reaction emoji
   */
  errorMessage?: string;
  /**
   * quickReactionEmojiIds are emojis that will be shown in the the primary view even if the reaction count is zero
   */
  quickReactionEmojis?: QuickReactionEmojiSummary;
  /**
   * Optional callback function called when opening reactions dialog
   */
  onDialogOpenCallback?: (emojiId: string, source?: string) => void;
  /**
   * Optional callback function called when closing reactions dialog
   */
  onDialogCloseCallback?: OnCloseHandler;
  /**
   * Optional callback function called when selecting a reaction in reactions dialog
   */
  onDialogSelectReactionCallback?: onDialogSelectReactionChange;
}

/**
 * Get content of the tooltip
 */
export function getTooltip(status: ReactionStatus, errorMessage?: string) {
  switch (status) {
    case ReactionStatus.error:
      return (
        errorMessage || <FormattedMessage {...i18n.messages.unexpectedError} />
      );
    // When reaction is not available don't show any tooltip (e.g. Archive page in Confluence)
    case ReactionStatus.disabled:
      return null;
    case ReactionStatus.notLoaded:
    case ReactionStatus.loading:
      return <FormattedMessage {...i18n.messages.loadingReactions} />;
    case ReactionStatus.ready:
      return <FormattedMessage {...i18n.messages.addReaction} />;
  }
}

/**
 * Renders list of reactions
 */
export const Reactions: React.FC<ReactionsProps> = React.memo(
  ({
    flash = {},
    status,
    errorMessage,
    loadReaction,
    quickReactionEmojis,
    pickerQuickReactionEmojiIds,
    getReactionDetails = () => {},
    onReactionHover = () => {},
    onSelection,
    reactions = [],
    emojiProvider,
    allowAllEmojis,
    onReactionClick,
    allowUserDialog,
    onDialogOpenCallback = () => {},
    onDialogCloseCallback = () => {},
    onDialogSelectReactionCallback = () => {},
    emojiPickerSize = 'medium',
    miniMode = false,
  }) => {
    const [selectedEmojiId, setSelectedEmojiId] = useState<string>();
    const { createAnalyticsEvent } = useAnalyticsEvents();

    let openTime = useRef<number>();
    let renderTime = useRef<number>();

    useEffect(() => {
      if (status === ReactionStatus.notLoaded) {
        loadReaction();
      }
    }, [status, loadReaction]);

    useEffect(() => {
      if (status !== ReactionStatus.ready) {
        renderTime.current = Date.now();
      } else {
        Analytics.createAndFireSafe(
          createAnalyticsEvent,
          Analytics.createReactionsRenderedEvent,
          renderTime.current ?? Date.now(), //renderTime.current can be null during unit test cases
        );
        renderTime.current = undefined;
      }
    }, [createAnalyticsEvent, status]);

    const handleReactionMouseEnter = useCallback(
      (emojiId: string) => {
        getReactionDetails(emojiId);
        onReactionHover(emojiId);
      },
      [getReactionDetails, onReactionHover],
    );

    const handleReactionFocused = useCallback(
      (emojiId: string) => {
        getReactionDetails(emojiId);
      },
      [getReactionDetails],
    );

    const handlePickerOpen = useCallback(() => {
      openTime.current = Date.now();
      Analytics.createAndFireSafe(
        createAnalyticsEvent,
        Analytics.createPickerButtonClickedEvent,
        reactions.length,
      );
    }, [createAnalyticsEvent, reactions]);

    const handleOnCancel = useCallback(() => {
      Analytics.createAndFireSafe(
        createAnalyticsEvent,
        Analytics.createPickerCancelledEvent,
        openTime.current,
      );
      openTime.current = undefined;
    }, [createAnalyticsEvent]);

    const handleOnMore = useCallback(() => {
      Analytics.createAndFireSafe(
        createAnalyticsEvent,
        Analytics.createPickerMoreClickedEvent,
        openTime.current,
      );
    }, [createAnalyticsEvent]);

    const handleOnSelection = useCallback(
      (emojiId: string, source: ReactionSource) => {
        Analytics.createAndFireSafe(
          createAnalyticsEvent,
          Analytics.createReactionSelectionEvent,
          source,
          emojiId,
          reactions.find((reaction) => reaction.emojiId === emojiId),
          openTime.current,
        );
        openTime.current = undefined;
        onSelection(emojiId);
      },
      [createAnalyticsEvent, onSelection, reactions],
    );

    /**
     * event handler to open selected reaction from tooltip
     * @param emojiId selected emoji id
     */
    const handleOpenReactionsDialog = (emojiId: string) => {
      // ufo start opening reaction dialog
      ufoExperiences.openDialog.start();

      setSelectedEmojiId(emojiId);
      onDialogOpenCallback(emojiId, 'tooltip');

      // ufo opening reaction dialog success
      ufoExperiences.openDialog.success({
        metadata: {
          emojiId: emojiId,
          source: 'Reactions',
          reason: 'Opening dialog from emoji tooltip link successfully',
        },
      });
    };

    /**
     * Event handler to oepn all reactions link button
     */
    const handleOpenAllReactionsDialog = () => {
      // ufo start opening reaction dialog
      ufoExperiences.openDialog.start();

      const emojiId = reactions[0].emojiId;
      getReactionDetails(emojiId);
      setSelectedEmojiId(emojiId);
      onDialogOpenCallback(emojiId, 'button');

      // ufo opening reaction dialog success
      ufoExperiences.openDialog.success({
        metadata: {
          emojiId: emojiId,
          source: 'Reactions',
          reason: 'Opening all reactions dialog link successfully',
        },
      });
    };

    const handleCloseReactionsDialog: OnCloseHandler = (
      e: KeyboardOrMouseEvent,
      analyticsEvent: UIAnalyticsEvent,
    ) => {
      // ufo closing opening reaction dialog
      ufoExperiences.closeDialog.start();

      setSelectedEmojiId('');
      onDialogCloseCallback(e, analyticsEvent);

      // ufo closing reaction dialog success
      ufoExperiences.closeDialog.success({
        metadata: {
          source: 'Reactions',
          reason: 'Closing reactions dialog successfully',
        },
      });
    };

    const handleSelectReactionInDialog = (
      emojiId: string,
      analyticsEvent: UIAnalyticsEvent,
    ) => {
      // ufo selected reaction inside the modal dialog
      ufoExperiences.selectedReactionChangeInsideDialog.start();

      handleReactionMouseEnter(emojiId);
      onDialogSelectReactionCallback(emojiId, analyticsEvent);

      // ufo selected reaction inside the modal dialog success
      ufoExperiences.selectedReactionChangeInsideDialog.success({
        metadata: {
          emojiId: emojiId,
          source: 'Reactions',
          reason: 'Selected Emoji changed',
        },
      });
    };

    /**
     * Get the reactions that we want to render are any reactions with a count greater than zero as well as any default emoji not already shown
     */
    const memorizedReactions = useMemo(() => {
      //
      /**
       * If reactions not empty, don't show quick reactions Pre defined emoji or if its empty => return the current list of reactions
       */
      if (reactions.length > 0 || !quickReactionEmojis) {
        return reactions;
      }

      // add any missing default reactions
      const { ari, containerAri, emojiIds } = quickReactionEmojis;
      const items: ReactionSummary[] = emojiIds
        .filter(
          (emojiId) =>
            !reactions.some((reaction) => reaction.emojiId === emojiId),
        )
        .map((emojiId) => {
          return {
            ari,
            containerAri,
            emojiId,
            count: 0,
            reacted: false,
          };
        });
      return reactions.concat(items);
    }, [quickReactionEmojis, reactions]);

    return (
      <div css={styles.wrapperStyle} data-testid={RENDER_REACTIONS_TESTID}>
        {memorizedReactions.map((reaction) => (
          <Reaction
            key={reaction.emojiId}
            reaction={reaction}
            emojiProvider={emojiProvider}
            onClick={onReactionClick}
            onMouseEnter={handleReactionMouseEnter}
            onFocused={handleReactionFocused}
            flash={flash[reaction.emojiId]}
            handleUserListClick={handleOpenReactionsDialog}
            allowUserDialog={allowUserDialog}
          />
        ))}
        <ReactionPicker
          css={styles.reactionPickerStyle}
          emojiProvider={emojiProvider}
          allowAllEmojis={allowAllEmojis}
          pickerQuickReactionEmojiIds={pickerQuickReactionEmojiIds}
          disabled={status !== ReactionStatus.ready}
          onSelection={handleOnSelection}
          onOpen={handlePickerOpen}
          onCancel={handleOnCancel}
          onShowMore={handleOnMore}
          tooltipContent={getTooltip(status, errorMessage)}
          emojiPickerSize={emojiPickerSize}
          miniMode={miniMode}
        />
        {allowUserDialog && reactions.length > 0 && (
          <Tooltip
            content={
              <FormattedMessage {...i18n.messages.seeWhoReactedTooltip} />
            }
            hideTooltipOnClick
          >
            <Button
              appearance="subtle-link"
              onClick={handleOpenAllReactionsDialog}
              css={styles.seeWhoReacted}
              testId={RENDER_VIEWALL_REACTED_USERS_DIALOG}
            >
              <FormattedMessage {...i18n.messages.seeWhoReacted} />
            </Button>
          </Tooltip>
        )}
        {/* https://atlassian.design/components/modal-dialog/examples#default */}
        <ModalTransition>
          {!!selectedEmojiId && (
            <ReactionsDialog
              selectedEmojiId={selectedEmojiId}
              reactions={memorizedReactions}
              emojiProvider={emojiProvider}
              handleCloseReactionsDialog={handleCloseReactionsDialog}
              handleSelectReaction={handleSelectReactionInDialog}
            />
          )}
        </ModalTransition>
      </div>
    );
  },
);
