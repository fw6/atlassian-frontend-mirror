import React, { FC, useState } from 'react';

import { Status } from '../../src';

const AvatarStatusWidthExample: FC = () => {
  const [width, setWidth] = useState(60);

  return (
    <div>
      <input
        min="10"
        max="130"
        onChange={e => setWidth(parseInt(e.target.value, 10))}
        step="10"
        title="Width"
        type="range"
        value={width}
      />
      <div style={{ maxWidth: width, border: '1px dotted blue' }}>
        <Status status="approved" />
      </div>
    </div>
  );
};

export default AvatarStatusWidthExample;
