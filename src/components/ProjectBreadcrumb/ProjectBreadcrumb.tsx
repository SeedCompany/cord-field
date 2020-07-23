import * as React from 'react';
import { Except } from 'type-fest';
import { Nullable } from '../../util';
import { SecuredBreadcrumb, SecuredBreadcrumbProps } from '../Breadcrumb';
import { ProjectBreadcrumbFragment } from './ProjectBreadcrumb.generated';

export interface ProjectBreadcrumbProps
  extends Except<Partial<SecuredBreadcrumbProps>, 'data'> {
  data?: Nullable<ProjectBreadcrumbFragment>;
}

export const ProjectBreadcrumb = ({
  data,
  ...rest
}: ProjectBreadcrumbProps) => (
  <SecuredBreadcrumb
    to={data ? `/projects/${data.id}` : '..'} // assume subpage until data loads
    data={data?.name}
    redacted="You don't have permission to view this project's name"
    loadingWidth={200}
    {...rest}
  />
);
