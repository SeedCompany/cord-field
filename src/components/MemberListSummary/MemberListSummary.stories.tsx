import { Card } from '@material-ui/core';
import { Group } from '@material-ui/icons';
import { number, text } from '@storybook/addon-knobs';
import React from 'react';
import seedRandom from 'seedrandom';
import {
  MemberListSummary,
  MemberListSummaryProps,
  MemberSummaryItem,
} from './MemberListSummary';

export default { title: 'Components/Member List Summary' };

const randomPersonPic = (name: string, gender: 'female' | 'male') => {
  const id = Number(seedRandom(name).quick().toFixed(2)) * 100;
  return `https://randomuser.me/api/portraits/${
    gender === 'female' ? 'women' : 'men'
  }/${id}.jpg`;
};

const people: Array<{ name: string; gender: 'female' | 'male' }> = [
  { name: 'Jim', gender: 'male' },
  { name: 'Sarah', gender: 'female' },
  { name: 'Julius', gender: 'male' },
  { name: 'Rachel', gender: 'female' },
  { name: 'Rob', gender: 'male' },
  { name: 'Katie', gender: 'female' },
];
export const members = people.map(
  ({ name, gender }): MemberSummaryItem => ({
    label: name,
    avatarLetters: name[0],
    picture: randomPersonPic(name, gender),
  })
);

const slider = (name: string) =>
  number(name, 4, {
    range: true,
    min: 0,
    max: people.length,
  });

const Story = (props: Partial<MemberListSummaryProps>) => (
  <Card style={{ maxWidth: 400 }}>
    <MemberListSummary
      members={members?.slice(0, slider('# of members'))}
      max={slider('max listed')}
      to={text('to', '/someplace')}
      icon={Group}
      title={text('title', 'Team Members')}
      {...props}
    />
  </Card>
);

export const WithData = () => <Story />;

export const Loading = () => <Story members={undefined} />;
