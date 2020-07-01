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
  const fullName = text('name', 'Julius Rosenberg');
  const avatarLetters = fullName
    .split(' ')
    .map((w) => w[0])
    .join('');
  const user: UserListItemFragment = {
    id: '123',
    fullName,
    avatarLetters,
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
