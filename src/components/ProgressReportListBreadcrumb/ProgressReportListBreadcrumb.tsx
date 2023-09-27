import { Skeleton } from '@mui/material';
import { IdFragment } from '~/common';
import { Breadcrumb, BreadcrumbProps } from '../Breadcrumb';
import { idForUrl } from '../Changeset';

interface ProgressReportListBreadcrumbProps extends BreadcrumbProps {
  engagement?: IdFragment;
}

export const ProgressReportListBreadcrumb = ({
  engagement,
  ...rest
}: ProgressReportListBreadcrumbProps) => (
  <Breadcrumb
    to={
      engagement
        ? `/engagements/${idForUrl(engagement)}/reports/progress`
        : undefined
    }
    {...rest}
  >
    {engagement ? 'Quarterly Reports' : <Skeleton width={200} />}
  </Breadcrumb>
);
