import { text } from '@storybook/addon-knobs';
import React from 'react';
import { UserListItemCardPortrait as UserCard } from './PortraitCard';

export default { title: 'Components/Portrait' };

export const PortraitCard = () => (
  <UserCard
    user={{
      id: '123',
      fullName: text('name', 'Julius Rosenberg'),
      displayFirstName: {
        value: text('displayFirstName', 'Julius'),
      },
      displayLastName: {
        value: text('displayFirstName', 'Rosenberg'),
      },
    }}
  />
);
