import React from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import SmartUserPicker from '../src/components/smart-user-picker/components';
import { setSmartUserPickerEnv } from '../src/components/smart-user-picker/config';
import { StylesConfig } from '@atlaskit/select';
import * as colors from '@atlaskit/theme/colors';

setSmartUserPickerEnv('local');
const Example = () => {
  const styles: StylesConfig = {
    control: style => ({
      ...style,
      backgroundColor: '#7B8597',
      borderRadius: 8,
    }),
    input: style => ({
      ...style,
      color: colors.N10,
    }),
  };

  return (
    <ExampleWrapper>
      {({ options, onInputChange }) => (
        <SmartUserPicker
          fieldId="example"
          productKey="jira"
          siteId={'497ea592-beb4-43c3-9137-a6e5fa301088'}
          onChange={console.log}
          onInputChange={onInputChange}
          isMulti
          defaultValue={[
            {
              id: '655363:23cdc6cc-d81e-492d-8fe1-ec56fb8094a4',
              type: 'user',
            },
          ]}
          styles={styles}
        />
      )}
    </ExampleWrapper>
  );
};
export default Example;
