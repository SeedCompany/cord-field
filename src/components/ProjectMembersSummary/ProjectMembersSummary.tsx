import { Group } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';
import { MemberListSummary, MemberSummaryItem } from '../MemberListSummary';
import { ProjectMemberListFragment } from './ProjectMembersSummary.generated';

export interface ProjectMembersSummaryProps {
  members?: ProjectMemberListFragment;
}

export const ProjectMembersSummary: FC<ProjectMembersSummaryProps> = ({
  members,
}) => {
  const summarizedMembers = members?.items.map(
    ({ user }): MemberSummaryItem => ({
      avatarLetters: user?.value?.avatarLetters ?? undefined,
      label: user?.value?.firstName ?? '',
    })
  );

  return (
    <MemberListSummary
      total={members?.total}
      title="Team Members"
      members={summarizedMembers}
      to="members"
      icon={Group}
    />
  );
};
