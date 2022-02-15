import { makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import * as React from 'react';
import { getProjectUrl } from '../../scenes/Projects/useProjectId';
import { Nullable } from '../../util';
import { Breadcrumb, BreadcrumbProps } from '../Breadcrumb';
import { Redacted } from '../Redacted';
import { SensitivityIcon } from '../Sensitivity';
import { ProjectBreadcrumbFragment } from './ProjectBreadcrumb.generated';

export interface ProjectBreadcrumbProps extends Partial<BreadcrumbProps> {
  data?: Nullable<ProjectBreadcrumbFragment>;
}

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginLeft: spacing(1),
  },
}));

export const ProjectBreadcrumb = ({
  data,
  ...rest
}: ProjectBreadcrumbProps) => {
  const classes = useStyles();

  return (
    <Breadcrumb
      to={data ? getProjectUrl(data) : undefined}
      LinkProps={{
        underline: data?.name.canRead ? undefined : 'none',
      }}
      {...rest}
      className={clsx(classes.root, rest.className)}
    >
      {data ? (
        <>
          {!data.name.canRead ? (
            <Redacted
              info="You don't have permission to view this project's name"
              width={200}
            />
          ) : (
            data.name.value
          )}
          <SensitivityIcon value={data.sensitivity} className={classes.icon} />
        </>
      ) : (
        <Skeleton width={200} />
      )}
    </Breadcrumb>
  );
};
