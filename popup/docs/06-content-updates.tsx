import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  Sometimes we will want to change the content inside the popup -
  but you'll notice it won't move itself it an appropriate position after because the parent popup doesn't actually know anything happened!
  To fix this you can use a function passed to the content called \`scheduleUpdate()\`!

  When called it will re-position the popup to its correct location.
  Make sure to **call this in the same callback or update step** to ensure everything happens in the same animation frame.

  ${(
    <Example
      packageName="@atlaskit/popup"
      Component={require('../examples/content-updates').default}
      source={require('!!raw-loader!../examples/content-updates')}
    />
  )}
`;
