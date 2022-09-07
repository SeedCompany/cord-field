import { Card } from '@mui/material';
import { Group } from '@mui/icons-material';
import { number, text } from '@storybook/addon-knobs';
import seedRandom from 'seedrandom';
import {
  MemberListSummary,
  MemberListSummaryProps,
  MemberSummaryItem,
} from './MemberListSummary';

export default {
  title: 'Components/Member List Summary',
  excludeStories: ['members', 'randomPersonPic'],
};

export const randomPersonPic = (name: string, gender: 'female' | 'male') => {
  const id = Number(seedRandom(name).quick().toFixed(2)) * 100;
  return `https://randomuser.me/api/portraits/${
    gender === 'female' ? 'women' : 'men'
  }/${id}.jpg`;
};

const people: Array<{ name: string; gender: 'female' | 'male'; id: string }> = [
  { name: 'Jim', gender: 'male', id: '1' },
  { name: 'Sarah', gender: 'female', id: '2' },
  { name: 'Julius', gender: 'male', id: '3' },
  { name: 'Rachel', gender: 'female', id: '4' },
  { name: 'Rob', gender: 'male', id: '5' },
  { name: 'Katie', gender: 'female', id: '6' },
];
export const members = people.map(
  ({ name, gender, id }): MemberSummaryItem => ({
    label: name,
    avatarLetters: name[0],
    picture: randomPersonPic(name, gender),
    id,
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
      members={members.slice(0, slider('# of members'))}
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
