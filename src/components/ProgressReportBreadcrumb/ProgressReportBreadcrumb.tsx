import { Skeleton } from '@mui/material';
import { Nullable } from '~/common';
import { Breadcrumb } from '../Breadcrumb';
import { ReportLabel } from '../PeriodicReports/ReportLabel';
import { ProgressReportBreadcrumbFragment } from './ProgressReportBreadcrumb.graphql';

interface ProgressReportBreadcrumbProps {
  data?: Nullable<ProgressReportBreadcrumbFragment>;
}

export const ProgressReportBreadcrumb = ({
  data,
}: ProgressReportBreadcrumbProps) => (
  <Breadcrumb to={data ? `/progress-reports/${data.id}` : undefined}>
    {!data ? <Skeleton width={200} /> : <ReportLabel report={data} />}
  </Breadcrumb>
);
