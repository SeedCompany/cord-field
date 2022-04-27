import { Card } from '@material-ui/core';
import React from 'react';
import {
  ProjectMembersSummary,
  ProjectMembersSummaryProps,
} from './ProjectMembersSummary';
import { ProjectMemberListFragment } from './ProjectMembersSummary.graphql';

export default { title: 'Components/Project Member Summary' };

const generateUser = (
  firstName: string,
  avatarLetters: string
): ProjectMemberListFragment['items'][number] => ({
  id: '',
  user: {
    value: {
      id: '',
      firstName,
      avatarLetters,
    },
    canRead: true,
    canEdit: true,
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
  hasMore: false,
  nextPage: 0,
};

const Story = (props: ProjectMembersSummaryProps) => (
  <Card style={{ maxWidth: 400 }}>
    <ProjectMembersSummary {...props} />
  </Card>
);

export const WithData = () => <Story members={memberList} />;

export const Loading = () => <Story members={undefined} />;
