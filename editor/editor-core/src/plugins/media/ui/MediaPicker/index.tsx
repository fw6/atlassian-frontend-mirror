import React from 'react';
import { ClipboardWrapper } from './ClipboardWrapper';
import { DropzoneWrapper } from './DropzoneWrapper';
import { BrowserWrapper } from './BrowserWrapper';
import { MediaPluginState } from '../../pm-plugins/types';

type Props = {
  mediaState: MediaPluginState;
};

type State = {
  isPopupOpened: boolean;
};

export class MediaPickerComponents extends React.Component<Props, State> {
  static displayName = 'MediaPickerComponents';

  state = {
    isPopupOpened: false,
  };

  componentDidMount() {
    const { mediaState } = this.props;
    mediaState.onPopupToggle(isPopupOpened => {
      this.setState({
        isPopupOpened,
      });
    });
  }

  onBrowseFn = (nativeBrowseFn: () => void) => {
    const { mediaState } = this.props;
    mediaState && mediaState.setBrowseFn(nativeBrowseFn);
  };

  render() {
    const { mediaState } = this.props;
    const { isPopupOpened } = this.state;
    return (
      <>
        <ClipboardWrapper mediaState={mediaState} />
        <DropzoneWrapper mediaState={mediaState} isActive={!isPopupOpened} />
        {!mediaState.shouldUseMediaPickerPopup() && (
          <BrowserWrapper
            onBrowseFn={this.onBrowseFn}
            mediaState={mediaState}
          />
        )}
      </>
    );
  }
}
