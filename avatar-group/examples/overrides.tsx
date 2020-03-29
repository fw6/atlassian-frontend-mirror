import React, { Fragment } from 'react';
import styled from 'styled-components';
import { AppearanceType, SizeType } from '@atlaskit/avatar';
import Button from '@atlaskit/button';
import AvatarGroup from '../src';
import { RANDOM_USERS } from '../examples-util/data';

const ButtonGroup = styled.div`
  margin: 8px;
  text-align: center;
`;

export default () => {
  const data = RANDOM_USERS.slice(0, 8).map(d => ({
    email: d.email,
    key: d.email,
    name: d.name,
    href: '#',
    appearance: 'circle' as AppearanceType,
    size: 'medium' as SizeType,
    enableTooltip: true,
  }));

  return (
    <AvatarGroup
      testId="overrides"
      appearance="stack"
      data={data}
      size="large"
      overrides={{
        AvatarGroupItem: {
          render: (Component, props, index) => {
            const avatarItem = <Component {...props} key={index} />;

            return index === data.length - 1 ? (
              <Fragment key={`${index}-overridden`}>
                {avatarItem}
                <ButtonGroup data-testid="load-more-actions">
                  <Button testId="load-more">Load more</Button>
                </ButtonGroup>
              </Fragment>
            ) : (
              avatarItem
            );
          },
        },
      }}
    />
  );
};
