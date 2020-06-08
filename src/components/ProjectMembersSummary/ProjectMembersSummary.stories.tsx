import { Card } from '@material-ui/core';
import React from 'react';
import { ArrayItem } from '../../util';
import {
  ProjectMembersSummary,
  ProjectMembersSummaryProps,
} from './ProjectMembersSummary';
import { ProjectMemberListFragment } from './ProjectMembersSummary.generated';

export default { title: 'Components/Project Member Summary' };

const generateUser = (
  firstName: string,
  avatarLetters: string
): ArrayItem<ProjectMemberListFragment['items']> => ({
  user: {
    value: {
      id: '',
      firstName,
      avatarLetters,
    },
  },
});

const memberList: ProjectMemberListFragment = {
  items: [
    generateUser('Julius', 'JC'),
    generateUser('Aaron', 'AH'),
    generateUser('Richard', 'RG'),
    generateUser('Ray', 'RJ'),
  ],
  total: 4,
};

const Story = (props: ProjectMembersSummaryProps) => (
  <Card style={{ maxWidth: 400 }}>
    <ProjectMembersSummary {...props} />
  </Card>
);

export const WithData = () => <Story members={memberList} />;

export const Loading = () => <Story members={undefined} />;
