import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { useParams } from 'react-router';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { useGetProjectBreadcrumbQuery } from './CreateProduct.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    overflowY: 'scroll',
    padding: spacing(4),
    maxWidth: breakpoints.values.md,
  },
}));

export const CreateProduct: FC = () => {
  const classes = useStyles();

  const { projectId, engagementId } = useParams();

  const { data } = useGetProjectBreadcrumbQuery({
    variables: {
      input: projectId,
    },
  });

  const project = data?.project;

  return (
    <main className={classes.root}>
      <Breadcrumbs>
        <ProjectBreadcrumb data={project} />
        <Breadcrumb to={`/projects/${projectId}/engagements`}>
          engagement
        </Breadcrumb>
        <Breadcrumb to={`/projects/${projectId}/engagements/${engagementId}`}>
          {engagementId}
        </Breadcrumb>
      </Breadcrumbs>
      <Typography variant="h2">Create Product</Typography>
    </main>
  );
};
