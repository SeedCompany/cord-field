import { Except } from 'type-fest';
import { Nullable } from '~/common';
import { SecuredBreadcrumb, SecuredBreadcrumbProps } from '../Breadcrumb';
import { idForUrl } from '../Changeset';
import { EngagementBreadcrumbFragment } from './EngagementBreadcrumb.graphql';

export interface EngagementBreadcrumbProps
  extends Except<Partial<SecuredBreadcrumbProps>, 'data'> {
  data?: Nullable<EngagementBreadcrumbFragment>;
}

export const EngagementBreadcrumb = ({
  data,
  ...rest
}: EngagementBreadcrumbProps) => {
  return (
    <SecuredBreadcrumb
      to={data ? `/engagements/${idForUrl(data)}` : undefined}
      data={
        data?.__typename === 'LanguageEngagement'
          ? data.language.value?.name ?? data.nameWhenUnknown
          : data?.__typename === 'InternshipEngagement'
          ? {
              canRead: !!(
                data.intern.value?.fullName || data.nameWhenUnknown.value
              ),
              value: data.intern.value?.fullName ?? data.nameWhenUnknown.value,
            }
          : undefined
      }
      redacted="You don't have permission to view this engagement's name"
      loadingWidth={200}
      {...rest}
    />
  );
};
