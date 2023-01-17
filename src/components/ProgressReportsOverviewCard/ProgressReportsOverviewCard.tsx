import { SecuredProp, StyleProps } from '~/common';
import { PeriodicReportCard } from '../PeriodicReports';
import { ProgressReportOverviewItemFragment as Report } from './ProgressReportOverview.graphql';

export interface ProgressReportsOverviewCardProps extends StyleProps {
  dueCurrently?: SecuredProp<Report>;
  dueNext?: SecuredProp<Report>;
}

export const ProgressReportsOverviewCard = ({
  dueCurrently,
  dueNext,
  ...rest
}: ProgressReportsOverviewCardProps) => (
  <PeriodicReportCard
    {...rest}
    type="Progress"
    dueCurrently={dueCurrently}
    dueNext={dueNext}
    disableIcon
    hasDetailPage
  />
);
