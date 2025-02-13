import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';
import MediaServicesAddCommentIcon from '@atlaskit/icon/glyph/media-services/add-comment';
import Popup from '@atlaskit/popup';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../src';

const containerStyles: React.CSSProperties = {
  width: 300,
  height: 300,
};

const DropdownMenuZIndex = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom-start"
      zIndex={600}
      content={() => (
        <Box padding="space.100" UNSAFE_style={containerStyles}>
          <DropdownMenu trigger="Page actions" zIndex={610} testId="dropdown">
            <DropdownItemGroup>
              <DropdownItem>Move</DropdownItem>
              <DropdownItem>Clone</DropdownItem>
              <DropdownItem>Delete</DropdownItem>
            </DropdownItemGroup>
          </DropdownMenu>
        </Box>
      )}
      trigger={(triggerProps) => (
        <Button
          {...triggerProps}
          isSelected={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          value="Add"
          iconBefore={<MediaServicesAddCommentIcon label="Add" />}
          testId="popup--trigger"
        />
      )}
    />
  );
};

export default DropdownMenuZIndex;
