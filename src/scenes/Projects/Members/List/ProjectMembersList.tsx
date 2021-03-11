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
import { List, useListQuery } from '../../../../components/List';
import { ProjectBreadcrumb } from '../../../../components/ProjectBreadcrumb';
import { ProjectMemberCard } from '../../../../components/ProjectMemberCard';
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
  const { projectId = '' } = useParams();
  const { root: data, ...list } = useListQuery(ProjectMembersDocument, {
    listAt: (res) => res.project.team,
    variables: {
      project: projectId,
    },
  });

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
      </div>
      {list.data?.canRead === false ? (
        <Typography>
          Sorry, you don't have permission to view this project's team members.
        </Typography>
      ) : (
        <List
          {...list}
          renderItem={(member) => (
            <ProjectMemberCard
              key={member.id}
              projectMember={member}
              className={classes.item}
              onEdit={() =>
                openUpdateProjectMemberDialog({
                  projectMemberId: member.id,
                  userId: member.user.value?.id || '',
                  userRoles: member.roles.value,
                })
              }
            />
          )}
          renderSkeleton={(index) => (
            <ProjectMemberCard key={index} className={classes.item} />
          )}
        />
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
