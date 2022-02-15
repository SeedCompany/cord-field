import * as React from 'react';
import { Except } from 'type-fest';
import { useProjectId } from '../../scenes/Projects/useProjectId';
import { Nullable } from '../../util';
import { SecuredBreadcrumb, SecuredBreadcrumbProps } from '../Breadcrumb';
import { EngagementBreadcrumbFragment } from './EngagementBreadcrumb.generated';

export interface EngagementBreadcrumbProps
  extends Except<Partial<SecuredBreadcrumbProps>, 'data'> {
  data?: Nullable<EngagementBreadcrumbFragment>;
}

export const EngagementBreadcrumb = ({
  data,
  ...rest
}: EngagementBreadcrumbProps) => {
  const { projectUrl } = useProjectId();
  return (
    <SecuredBreadcrumb
      to={data ? `${projectUrl}/engagements/${data.id}` : undefined}
      data={
        data?.__typename === 'LanguageEngagement'
          ? data.language.value?.name
          : undefined
      }
      redacted="You don't have permission to view this engagement's name"
      loadingWidth={200}
      {...rest}
    />
  );
};
