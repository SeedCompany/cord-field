import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';
import { UserListItemCardPortrait as UserCard } from './PortraitCard';
import { UserListItemFragment } from './UserListItem.generated';

export default {
  title: 'Components/User List Item',
  excludeStories: ['generateUserListItem'],
};

export const Portrait = () => <UserCard user={generateUserListItem()} />;

export const generateUserListItem = () => {
  const displayFirstName = text('First Name', 'Julius');
  const displayLastName = text('Last Name', 'Rosenberg');

  const avatarLetters = `${displayFirstName[0]} ${displayLastName[0]}`;

  const title = { value: 'Field Coordinator' };
  const user: UserListItemFragment = {
    id: '123',
    displayFirstName: {
      value: displayFirstName,
    },
    displayLastName: {
      value: displayLastName,
    },
    avatarLetters,
    title,
    organizations: {
      items: [
        {
          id: 'qwerty',
          name: {
            value: text('organization', 'Seed Co'),
          },
        },
      ],
    },
  };
  return boolean('loading', false) ? undefined : user;
};
