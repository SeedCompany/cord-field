import { Group } from '@material-ui/icons';
import { MemberListSummary, MemberSummaryItem } from '../MemberListSummary';
import { ProjectMemberListFragment } from './ProjectMembersSummary.graphql';

export interface ProjectMembersSummaryProps {
  members?: ProjectMemberListFragment;
}

export const ProjectMembersSummary = ({
  members,
}: ProjectMembersSummaryProps) => {
  const summarizedMembers = members?.items
    .filter(({ user }) => user.canRead && user.value)
    .map(({ user }) => user.value!)
    .map(
      (user): MemberSummaryItem => ({
        avatarLetters: user.avatarLetters ?? undefined,
        label: user.firstName ?? '',
        id: user.id,
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
