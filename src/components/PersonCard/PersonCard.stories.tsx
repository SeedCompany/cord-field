import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';
import { PersonCard } from './PersonCard';

export default { title: 'Components/PersonCard' };

export const PersonCardStory = () => (
  <PersonCard
    name={text('name', 'Julius')}
    organization={text('organization', 'Seed Company')}
    role={text('role', 'Software Developer')}
    active={boolean('active', true)}
    personRoute={text('personRoute', '/someRoute')}
    imageSource={text('imageSource', 'images/favicon-32x32.png')}
  />
);
