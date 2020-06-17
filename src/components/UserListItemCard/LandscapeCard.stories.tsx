import { text } from '@storybook/addon-knobs';
import React from 'react';
import { UserListItemCardLandscape as UserCard } from './LandscapeCard';

export default { title: 'Components/Landscape' };

export const LandscapeCard = () => (
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
