import { useQuery } from '@apollo/client';
import { makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDialog } from '../../../../components/Dialog';
import { Fab } from '../../../../components/Fab';
import { ContentContainer as Content } from '../../../../components/Layout';
import { ProjectDetailNavigation } from '../../../../components/ProjectDetailNavigation';
import { ProjectMemberCard } from '../../../../components/ProjectMemberCard';
import { listOrPlaceholders } from '../../../../util';
import { CreateProjectMember } from '../Create/CreateProjectMember';
import { UpdateProjectMember, UpdateProjectMemberFormParams } from '../Update';
import { ProjectMembersDocument } from './ProjectMembers.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  headerContainer: {
    margin: spacing(3, 0),
    display: 'flex',
  },
  title: {
    marginRight: spacing(3),
  },
  list: {
    maxWidth: breakpoints.values.sm,
  },
  item: {
    marginBottom: spacing(3),
  },
}));

export const ProjectMembersList: FC = () => {
  const classes = useStyles();
  const { projectId } = useParams();
  const { data } = useQuery(ProjectMembersDocument, {
    variables: {
      input: projectId,
    },
  });
  const members = data?.project.team;

  const [
    createProjectMemberDialogState,
    openCreateProjectMemberDialog,
  ] = useDialog();

  const [
    updateProjectMemberDialogState,
    openUpdateProjectMemberDialog,
    projectMemberProps,
  ] = useDialog<UpdateProjectMemberFormParams>();

  return (
    <Content>
      <ProjectDetailNavigation project={data?.project} title="Team Members" />
      <div className={classes.headerContainer}>
        <Typography variant="h2" className={classes.title}>
          Team Members
        </Typography>
        {(!members || members.canCreate) && (
          <Tooltip title="Add Team Member">
            <Fab
              color="error"
              aria-label="Add Team Member"
              loading={!members}
              onClick={openCreateProjectMemberDialog}
            >
              <Add />
            </Fab>
          </Tooltip>
        )}
        <CreateProjectMember
          {...createProjectMemberDialogState}
          projectId={projectId}
        />
      </div>
      {members?.canRead === false ? (
        <Typography>
          Sorry, you don't have permission to view this project's team members.
        </Typography>
      ) : (
        <div className={classes.list}>
          {listOrPlaceholders(members?.items, 5).map((item, index) => (
            <ProjectMemberCard
              key={item?.id ?? index}
              projectMember={item}
              className={classes.item}
              onEdit={() =>
                item &&
                openUpdateProjectMemberDialog({
                  projectMemberId: item.id,
                  userId: item.user.value?.id || '',
                  userRoles: item.roles.value,
                })
              }
            />
          ))}
        </div>
      )}
      {projectMemberProps && (
        <UpdateProjectMember
          {...updateProjectMemberDialogState}
          {...projectMemberProps}
        />
      )}
    </Content>
  );
};
