import { Language } from '@material-ui/icons';
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { SidebarListLink } from './SidebarListLink';

export default { title: 'Components/Root' };

export const SidebarListLinkStory = () => (
  <SidebarListLink
    to={text('to', '/SomePlace')}
    linkName={text('linkName', 'SomePlace')}
    icon={<Language />}
  />
);
