import { text } from '@storybook/addon-knobs';
import React from 'react';
import { UserListItemCard as UserListItemCardComponent } from './UserListItemCard';

export default { title: 'Components' };

export const PersonCard = () => (
  <UserListItemCardComponent
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
