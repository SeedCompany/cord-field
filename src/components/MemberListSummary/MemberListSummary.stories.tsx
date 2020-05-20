import { Group } from '@material-ui/icons';
import { number, text } from '@storybook/addon-knobs';
import React from 'react';
import {
  MemberListSummary as MemberListSummaryComponent,
  MemberSummaryItem,
} from './MemberListSummary';

export default { title: 'Components/Member List Summary' };

const membersHardCoded: MemberSummaryItem[] = [
  {
    picture: 'images/favicon-32x32.png',
    avatarLetters: 'J',
    label: 'Jim',
  },
  {
    avatarLetters: 'S',
    label: 'Sarah',
  },
  {
    picture: 'images/favicon-32x32.png',
    avatarLetters: 'Ju',
    label: 'Julius',
  },
  {
    picture: 'images/favicon-32x32.png',
    avatarLetters: 'K',
    label: 'Kevin',
  },
  {
    picture: 'images/favicon-32x32.png',
    avatarLetters: 'R',
    label: 'Rob',
  },
  {
    picture: 'images/favicon-32x32.png',
    avatarLetters: 'K',
    label: 'Katie',
  },
];

const MAX_MEMBERS_TO_DISPLAY = 4;

const generateMemberListComponent = (members: MemberSummaryItem[]) => {
  return (
    <MemberListSummaryComponent
      members={members}
      max={number('max members to display', MAX_MEMBERS_TO_DISPLAY)}
      to={text('to', '/someplace')}
      icon={Group}
      title={text('title', 'Team Members')}
    />
  );
};

export const LessThanMaxItems = () =>
  generateMemberListComponent(
    membersHardCoded.slice(0, MAX_MEMBERS_TO_DISPLAY - 1)
  );

export const EqualToMaxItems = () =>
  generateMemberListComponent(
    membersHardCoded.slice(0, MAX_MEMBERS_TO_DISPLAY)
  );

export const GreaterThanMaxItemsBy1 = () =>
  generateMemberListComponent(
    membersHardCoded.slice(0, MAX_MEMBERS_TO_DISPLAY + 1)
  );

export const GreaterThanMaxItemsBy2 = () =>
  generateMemberListComponent(
    membersHardCoded.slice(0, MAX_MEMBERS_TO_DISPLAY + 2)
  );

export const Loading = () => (
  <MemberListSummaryComponent
    title={text('title', 'Team Members')}
    icon={Group}
    to={text('to', '/someplace')}
  />
);
