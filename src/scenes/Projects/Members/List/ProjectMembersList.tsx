import { Add } from '@mui/icons-material';
import { Box, Breadcrumbs, Tooltip, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Breadcrumb } from '../../../../components/Breadcrumb';
import { useDialog } from '../../../../components/Dialog';
import { Fab } from '../../../../components/Fab';
import { List, useListQuery } from '../../../../components/List';
import { ProjectBreadcrumb } from '../../../../components/ProjectBreadcrumb';
import { ProjectMemberCard } from '../../../../components/ProjectMemberCard';
import { useProjectId } from '../../useProjectId';
import { CreateProjectMember } from '../Create/CreateProjectMember';
import { UpdateProjectMember, UpdateProjectMemberFormParams } from '../Update';
import { ProjectMembersDocument } from './ProjectMembers.graphql';

export const ProjectMembersList = () => {
  const { projectId, changesetId } = useProjectId();
  const { root: data, ...list } = useListQuery(ProjectMembersDocument, {
    listAt: (res) => res.project.team,
    variables: {
      project: projectId,
      changeset: changesetId,
    },
  });

  const [createProjectMemberDialogState, openCreateProjectMemberDialog] =
    useDialog();

  const [
    updateProjectMemberDialogState,
    openUpdateProjectMemberDialog,
    projectMemberProps,
  ] = useDialog<UpdateProjectMemberFormParams>();

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        p: 4,
        maxWidth: 'sm',
      }}
    >
      <Helmet
        title={`Team Members - ${data?.project.name.value ?? 'A Project'}`}
      />
      <Breadcrumbs>
        <ProjectBreadcrumb data={data?.project} />
        <Breadcrumb to=".">Team Members</Breadcrumb>
      </Breadcrumbs>
      <Box sx={{ my: 3, mx: 0, display: 'flex' }}>
        <Typography variant="h2" sx={{ mr: 3 }}>
          Team Members
        </Typography>
        {(!list.data || list.data.canCreate) && (
          <Tooltip title="Add Team Member">
            <Fab
              color="error"
              aria-label="Add Team Member"
              loading={!list.data}
              onClick={openCreateProjectMemberDialog}
            >
              <Add />
            </Fab>
          </Tooltip>
        )}
        {data && (
          <CreateProjectMember
            {...createProjectMemberDialogState}
            project={data.project}
          />
        )}
      </Box>
      {list.data?.canRead === false ? (
        <Typography>
          Sorry, you don't have permission to view this project's team members.
        </Typography>
      ) : (
        <List
          {...list}
          spacing={3}
          renderItem={(member) => (
            <ProjectMemberCard
              projectMember={member}
              onEdit={() =>
                openUpdateProjectMemberDialog({
                  project: data!.project,
                  projectMemberId: member.id,
                  userId: member.user.value?.id || '',
                  userRoles: member.roles.value,
                })
              }
            />
          )}
          renderSkeleton={<ProjectMemberCard />}
        />
      )}
      {projectMemberProps && (
        <UpdateProjectMember
          {...updateProjectMemberDialogState}
          {...projectMemberProps}
        />
      )}
    </Box>
  );
};
