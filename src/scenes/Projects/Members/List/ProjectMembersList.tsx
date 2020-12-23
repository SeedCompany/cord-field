import { useQuery } from '@apollo/client';
import {
  Breadcrumbs,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../../components/Breadcrumb';
import { useDialog } from '../../../../components/Dialog';
import { Fab } from '../../../../components/Fab';
import { ProjectBreadcrumb } from '../../../../components/ProjectBreadcrumb';
import { ProjectMemberCard } from '../../../../components/ProjectMemberCard';
import { listOrPlaceholders } from '../../../../util';
import { CreateProjectMember } from '../Create/CreateProjectMember';
import { UpdateProjectMember, UpdateProjectMemberFormParams } from '../Update';
import { ProjectMembersDocument } from './ProjectMembers.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
    maxWidth: breakpoints.values.sm,
  },
  headerContainer: {
    margin: spacing(3, 0),
    display: 'flex',
  },
  title: {
    marginRight: spacing(3),
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
    <div className={classes.root}>
      <Helmet
        title={`Team Members - ${data?.project.name.value ?? 'A Project'}`}
      />
      <Breadcrumbs>
        <ProjectBreadcrumb data={data?.project} />
        <Breadcrumb to=".">Team Members</Breadcrumb>
      </Breadcrumbs>
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
        listOrPlaceholders(members?.items, 5).map((item, index) => (
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
        ))
      )}
      {projectMemberProps && (
        <UpdateProjectMember
          {...updateProjectMemberDialogState}
          {...projectMemberProps}
        />
      )}
    </div>
  );
};
