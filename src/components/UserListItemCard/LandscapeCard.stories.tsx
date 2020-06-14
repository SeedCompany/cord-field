import { number, text } from '@storybook/addon-knobs';
import React from 'react';
import { UserListItemCardLandscape as UserCard } from './LandscapeCard';

export default { title: 'Components/Landscape' };

export const LandscapeCard = () => (
  <UserCard
    user={{
      id: '456789',
      avatarLetters: text('avatarLetters', 'BN'),
      project: {
        name: text('name', 'Pei Tribe'),
        location: text('location', 'Papua New Guinea, Oceania'),
      },
      activeProjects: number('activeProjects', 5),
    }}
  />
);
