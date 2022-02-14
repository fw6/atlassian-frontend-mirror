import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { WidthConsumer } from '@atlaskit/editor-common/ui';
import { ContextPanelConsumer } from '../../ContextPanel/context';
import { EditorView } from 'prosemirror-view';
import React, { ReactElement } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';

import EditorActions from '../../../actions';
import { EventDispatcher } from '../../../event-dispatcher';
import {
  ReactComponents,
  EditorAppearance,
  UIComponentFactory,
} from '../../../types';
import { ClickAreaBlock } from '../../Addon';
import ContextPanel from '../../ContextPanel';
import PluginSlot from '../../PluginSlot';
import WidthEmitter from '../../WidthEmitter';
import {
  ContentArea,
  EditorContentArea,
  SidebarArea,
  ScrollContainer,
  EditorContentGutter,
} from './StyledComponents';
import { DispatchAnalyticsEvent } from '../../../plugins/analytics';
import messages from './messages';

interface FullPageEditorContentAreaProps {
  allowAnnotation: boolean | undefined;
  appearance: EditorAppearance | undefined;
  contentArea: HTMLElement | undefined;
  contentComponents: UIComponentFactory[] | undefined;
  contextPanel: ReactComponents | undefined;
  customContentComponents: ReactComponents | undefined;
  disabled: boolean | undefined;
  dispatchAnalyticsEvent: DispatchAnalyticsEvent | undefined;
  editorActions: EditorActions | undefined;
  editorDOMElement: ReactElement;
  editorView: EditorView;
  eventDispatcher: EventDispatcher | undefined;
  popupsMountPoint: HTMLElement | undefined;
  popupsBoundariesElement: HTMLElement | undefined;
  popupsScrollableElement: HTMLElement | undefined;
  providerFactory: ProviderFactory;
  scrollContainer: HTMLElement | null;
  contentAreaRef(ref: HTMLElement | null): void;
  scrollContainerRef(ref: HTMLElement | null): void;
}

export const CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';

const Content: React.FunctionComponent<
  FullPageEditorContentAreaProps & WrappedComponentProps
> = React.memo((props) => {
  return (
    <WidthConsumer>
      {({ width }) => (
        <ContextPanelConsumer>
          {({ positionedOverEditor }) => (
            <ContentArea
              data-testid={CONTENT_AREA_TEST_ID}
              positionedOverEditor={positionedOverEditor}
            >
              <ScrollContainer
                innerRef={props.scrollContainerRef}
                allowAnnotation={props.allowAnnotation}
                className="fabric-editor-popup-scroll-parent"
              >
                <ClickAreaBlock editorView={props.editorView}>
                  <EditorContentArea
                    role="region"
                    aria-label={props.intl.formatMessage(
                      messages.editableContentLabel,
                    )}
                    fullWidthMode={props.appearance === 'full-width'}
                    innerRef={props.contentAreaRef}
                    containerWidth={width}
                  >
                    <EditorContentGutter
                      className={[
                        'ak-editor-content-area',
                        props.appearance === 'full-width'
                          ? 'fabric-editor--full-width-mode'
                          : '',
                      ].join(' ')}
                    >
                      {props.customContentComponents}
                      <PluginSlot
                        editorView={props.editorView}
                        editorActions={props.editorActions}
                        eventDispatcher={props.eventDispatcher}
                        providerFactory={props.providerFactory}
                        appearance={props.appearance}
                        items={props.contentComponents}
                        contentArea={props.contentArea}
                        popupsMountPoint={props.popupsMountPoint}
                        popupsBoundariesElement={props.popupsBoundariesElement}
                        popupsScrollableElement={props.popupsScrollableElement}
                        disabled={!!props.disabled}
                        containerElement={props.scrollContainer}
                        dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
                      />
                      {props.editorDOMElement}
                    </EditorContentGutter>
                  </EditorContentArea>
                </ClickAreaBlock>
              </ScrollContainer>
              <SidebarArea>
                {props.contextPanel || <ContextPanel visible={false} />}
              </SidebarArea>
              <WidthEmitter editorView={props.editorView} />
            </ContentArea>
          )}
        </ContextPanelConsumer>
      )}
    </WidthConsumer>
  );
});

export const FullPageContentArea = injectIntl(Content);
