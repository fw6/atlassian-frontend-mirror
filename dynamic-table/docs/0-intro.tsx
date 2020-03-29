import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  The Dynamic Table component is a table component with pagination and sorting functionality.
  Dynamic table also allows you to reorder rows (available only with react@^16.0.0) thanks to [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) library.

  ## Usage

  ${code`import DynamicTable from '@atlaskit/dynamic-table';`}

  or

  ${code`import { DynamicTableStateless } from '@atlaskit/dynamic-table';`}

  ${(
    <Example
      packageName="@atlaskit/dynamic-table"
      Component={require('../examples/0-stateful').default}
      title="Stateful"
      source={require('!!raw-loader!../examples/0-stateful')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/dynamic-table"
      Component={require('../examples/1-stateless').default}
      title="Stateless"
      source={require('!!raw-loader!../examples/1-stateless')}
    />
  )}

  ${(
    <Props
      heading="Stateful DynamicTable Props"
      props={require('!!extract-react-types-loader!../src/components/Stateful')}
    />
  )}

  ${(
    <Props
      heading="Stateless DynamicTable Props"
      props={require('!!extract-react-types-loader!../src/components/Stateless')}
    />
  )}

  ## Gotchas

  ### Sorting

  Make sure to define a unique \`key\` for every cell,
  you can see this at work in [one of the table examples](https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/core/dynamic-table/examples/content/sample-data.tsx#lines-79).
  The reason for this is they're used to uniquely identify the elements so sorting can occur (and React can do its bit too)!
`;
