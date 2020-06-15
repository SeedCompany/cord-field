import {
  Breadcrumbs as BreadCrumbs,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../../components/Breadcrumb';
import { Fab } from '../../../../components/Fab';
import { ProjectMemberCard } from '../../../../components/ProjectMemberCard';
import { listOrPlaceholders } from '../../../../util';
import { useProjectMembersQuery } from './ProjectMembers.generated';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
  },
  breadcrumbs: {
    marginBottom: spacing(4),
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: spacing(4),
    height: '50px',
  },
  projectItem: {
    marginBottom: spacing(3),
  },
}));

export const ProjectMembersList: FC = () => {
  const classes = useStyles();
  const { projectId } = useParams();
  const { data } = useProjectMembersQuery({
    variables: {
      input: projectId,
    },
  });

  return (
    <div className={classes.root}>
      <BreadCrumbs className={classes.breadcrumbs}>
        <Breadcrumb to={`/projects/${projectId}`}>
          {data?.project?.name.value}
        </Breadcrumb>
        <Breadcrumb to={`/projects/${projectId}/members`}>
          Team Members
        </Breadcrumb>
      </BreadCrumbs>
      <div className={classes.container}>
        <Typography variant="h2">Team Members</Typography>
        {data?.project.team.canCreate && (
          <Fab color="error" aria-label="Add Team Member">
            <Add />
          </Fab>
        )}
      </div>
      {listOrPlaceholders(data?.project.team.items, 5).map((item, index) => (
        <ProjectMemberCard
          key={item?.id ?? index}
          projectMember={item}
          className={classes.projectItem}
          onEdit={() => console.log('EDIT CLICKED')}
        />
      ))}
    </div>
  );
};
