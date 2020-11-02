/** @jsx jsx */
import { jsx } from '@emotion/core';

import TextArea from '../src';

export default () => (
  <div
    id="resize"
    css={{
      maxWidth: 500,
    }}
  >
    <p>Resize: auto</p>
    <TextArea resize="auto" name="area" testId="autoResizeTextArea" />
    <p>Resize: vertical</p>
    <TextArea resize="vertical" name="area" testId="verticalResizeTextArea" />
    <p>Resize: horizontal</p>
    <TextArea
      resize="horizontal"
      name="area"
      testId="horizontalResizeTextArea"
    />
    <p>Resize: smart (default)</p>
    <TextArea name="area" testId="smartResizeTextArea" />
    <p>Resize: none</p>
    <TextArea resize="none" name="area" testId="noneResizeTextArea" />
  </div>
);
