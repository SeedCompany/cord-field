import { Breadcrumbs, makeStyles } from '@material-ui/core';
import React, { FC, ReactNode } from 'react';
import { Breadcrumb } from '../Breadcrumb';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { ProjectBreadcrumb } from '../ProjectBreadcrumb';
import { ProjectDetailNavigationFragment } from './ProjectDetailNavigation.generated';

const useStyles = makeStyles(({ spacing }) => ({
  properties: {
    marginTop: spacing(1),
  },
}));

interface ProjectDetailNavigationProps {
  project?: ProjectDetailNavigationFragment;
  title: string | ReactNode;
}

export const ProjectDetailNavigation: FC<ProjectDetailNavigationProps> = (
  props
) => {
  const { project, title, children } = props;
  const classes = useStyles();
  return (
    <>
      <Breadcrumbs>
        <ProjectBreadcrumb data={project} />
        {typeof title === 'string' ? (
          <Breadcrumb to=".">{title}</Breadcrumb>
        ) : (
          title
        )}
        {children}
      </Breadcrumbs>
      <div className={classes.properties}>
        <DisplaySimpleProperty
          label="Sensitivity"
          loading={!project}
          loadingWidth={100}
          value={project?.sensitivity}
        />
      </div>
    </>
  );
};
