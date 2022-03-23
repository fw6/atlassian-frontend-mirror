import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { N200, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { AddOptionAvatar } from '../../../components/AddOptionAvatar';
import {
  AvatarItemOption,
  textWrapper,
} from '../../../components/AvatarItemOption';
import {
  EmailOption,
  EmailOptionProps,
} from '../../../components/EmailOption/main';
import { Email, EmailType } from '../../../types';
import { renderProp } from '../_testUtils';

jest.mock('../../../components/AvatarItemOption', () => ({
  ...(jest.requireActual('../../../components/AvatarItemOption') as any),
  textWrapper: jest.fn(),
}));

describe('EmailOption', () => {
  const mockTextWrapper = textWrapper as jest.Mock;

  afterEach(() => {
    jest.resetAllMocks();
  });

  const shallowEmailOption = (props: EmailOptionProps) =>
    shallow(<EmailOption {...props} />);

  const email: Email = {
    type: EmailType,
    id: 'test@test.com',
    name: 'test@test.com',
    lozenge: 'EMAIL',
  };

  const suggestedEmail: Email = {
    type: EmailType,
    id: 'test@test.com',
    name: 'test@test.com',
    lozenge: 'EMAIL',
    suggestion: true,
  };

  it('should render AvatarItemOption with default message', () => {
    const component = shallowEmailOption({
      isSelected: false,
      email,
      emailValidity: 'VALID',
    });

    const formattedMessage = component.find(FormattedMessage);
    expect(formattedMessage).toHaveLength(1);
    const message = renderProp(formattedMessage, 'children', 'Invite');
    const avatarItemOption = message.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text', N800));
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text.subtlest', N200),
    );
    expect(avatarItemOption.props()).toMatchObject({
      avatar: <AddOptionAvatar label="Invite" />,
      primaryText: <span key="name">test@test.com</span>,
      secondaryText: <span>Invite</span>,
      lozenge: {
        text: 'EMAIL',
      },
    });
  });

  it('should render AvatarItemOption for suggested emails', () => {
    const component = shallowEmailOption({
      isSelected: false,
      email: suggestedEmail,
      emailValidity: 'VALID',
    });

    const formattedMessage = component.find(FormattedMessage);
    expect(formattedMessage).toHaveLength(1);
    const message = renderProp(formattedMessage, 'children', 'Invite');
    const avatarItemOption = message.find(AvatarItemOption);

    expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text', N800));
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text.subtlest', N200),
    );
    expect(avatarItemOption.props()).toMatchObject({
      avatar: <AddOptionAvatar label="Invite" />,
      primaryText: <span key="name">test@test.com</span>,
      secondaryText: <span>Invite</span>,
      lozenge: {
        text: 'EMAIL',
      },
    });
  });

  it('should override the default label', () => {
    const component = shallowEmailOption({
      isSelected: false,
      email,
      label: 'Add new user',
      emailValidity: 'VALID',
    });
    const avatarItemOption = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text', N800));
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text.subtlest', N200),
    );
    expect(avatarItemOption.props()).toMatchObject({
      avatar: <AddOptionAvatar label="Add new user" />,
      primaryText: <span key="name">test@test.com</span>,
      secondaryText: <span>Add new user</span>,
    });
  });
});
