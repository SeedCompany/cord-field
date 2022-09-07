import { Skeleton } from '@mui/material';
import { Except } from 'type-fest';
import { Nullable, SecuredProp } from '~/common';
import { Redacted, RedactedProps } from '../Redacted';
import { Breadcrumb, BreadcrumbProps } from './Breadcrumb';

export interface SecuredBreadcrumbProps extends BreadcrumbProps {
  data: Nullable<Except<SecuredProp<string>, 'canEdit'>>;
  loadingWidth?: string | number;
  redacted: RedactedProps['info'];
}

export const SecuredBreadcrumb = ({
  data,
  redacted,
  loadingWidth = 200,
  ...rest
}: SecuredBreadcrumbProps) => (
  <Breadcrumb
    {...rest}
    LinkProps={{
      underline: data?.canRead ? undefined : 'none',
    }}
  >
    {data ? (
      !data.canRead ? (
        <Redacted info={redacted} width={loadingWidth} />
      ) : (
        data.value
      )
    ) : (
      <Skeleton width={loadingWidth} />
    )}
  </Breadcrumb>
);
