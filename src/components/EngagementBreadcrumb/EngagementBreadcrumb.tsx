import * as React from 'react';
import { Except } from 'type-fest';
import { Nullable } from '../../util';
import { SecuredBreadcrumb, SecuredBreadcrumbProps } from '../Breadcrumb';
import { EngagementBreadcrumbFragment } from './EngagementBreadcrumb.generated';

export interface EngagementBreadcrumbProps
  extends Except<Partial<SecuredBreadcrumbProps>, 'data'> {
  data?: Nullable<EngagementBreadcrumbFragment>;
  projectId?: string;
}

export const EngagementBreadcrumb = ({
  data,
  projectId,
  ...rest
}: EngagementBreadcrumbProps) => (
  <SecuredBreadcrumb
    to={data ? `/projects/${projectId}/engagements/${data.id}` : '..'} // assume subpage until data loads
    data={
      data?.__typename === 'LanguageEngagement'
        ? data.language.value?.name
        : undefined
    }
    redacted="You don't have permission to view this project's name"
    loadingWidth={200}
    {...rest}
  />
);
