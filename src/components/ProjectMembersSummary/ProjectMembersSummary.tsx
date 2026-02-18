import { Group } from '@mui/icons-material';
import { MemberListSummary, MemberSummaryItem } from '../MemberListSummary';
import { ProjectMembersSummaryFragment as Project } from './ProjectMembersSummary.graphql';

export interface ProjectMembersSummaryProps {
  project?: Project;
}

export const ProjectMembersSummary = ({
  project,
}: ProjectMembersSummaryProps) => {
  const summarizedMembers = project?.team.items
    .filter(({ active, user }) => active && user.canRead && user.value)
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
      total={project?.activeMembers.total}
      title="Team Members"
      members={summarizedMembers}
      to="members"
      icon={Group}
    />
  );
};
