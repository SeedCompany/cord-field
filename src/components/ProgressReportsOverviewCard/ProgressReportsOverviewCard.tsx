import { Box, Card, CardActions, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';
import {
  ProgressReportStatusList as Statuses,
  ProgressReportStatusLabels as StatusLabels,
} from '~/api/schema/enumLists';
import { SecuredProp, StyleProps } from '~/common';
import { Due } from '../PeriodicReports/OverviewCard/ReportInfo';
import { ReportInfoContainer } from '../PeriodicReports/OverviewCard/ReportInfoContainer';
import { ReportLabel } from '../PeriodicReports/ReportLabel';
import { ButtonLink } from '../Routing';
import { ProgressReportOverviewItemFragment as Report } from './ProgressReportOverview.graphql';

const LastStatus = Statuses[Statuses.length - 1];

export interface ProgressReportsOverviewCardProps extends StyleProps {
  dueCurrently?: SecuredProp<Report>;
  dueNext?: SecuredProp<Report>;
}

export const ProgressReportsOverviewCard = ({
  dueCurrently,
  dueNext,
  ...rest
}: ProgressReportsOverviewCardProps) => (
  <Card {...rest} sx={{ width: 1 }}>
    <CardContent sx={{ width: 1 }}>
      <Typography variant="h4" paragraph>
        Progress Reports
      </Typography>
      <ReportInfoContainer horizontalAt={260} spaceEvenlyAt={430}>
        {dueCurrently?.value && (
          <ReportInfo title="Current" report={dueCurrently.value} extra />
        )}
        {dueNext?.value && <ReportInfo title="Next" report={dueNext.value} />}
      </ReportInfoContainer>
    </CardContent>
    <CardActions sx={{ justifyContent: 'space-between' }}>
      {dueCurrently?.value &&
        (dueCurrently.value.status.value === 'NotStarted' ? (
          <ButtonLink
            color="primary"
            to={`/progress-reports/${dueCurrently.value.id}/edit`}
          >
            Start Report
          </ButtonLink>
        ) : (
          <ButtonLink
            color="primary"
            to={`/progress-reports/${dueCurrently.value.id}`}
          >
            View Report
          </ButtonLink>
        ))}
      <ButtonLink color="primary" to="reports/progress">
        All Reports
      </ButtonLink>
    </CardActions>
  </Card>
);

const ReportInfo = ({
  title,
  report,
  extra,
  ...rest
}: {
  title: ReactNode;
  report: Report;
  extra?: boolean;
} & StyleProps) => {
  const status = report.status.value;
  const skipped = report.skippedReason.value;
  const isDue = status !== LastStatus && !skipped;
  return (
    <Box {...rest}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" sx={{ my: 1 }}>
        <ReportLabel report={report} />
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {skipped && 'Skipped'}
        {extra && (
          <>
            {status && !skipped && StatusLabels[status]}
            {status && isDue && <> &mdash; </>}
            {isDue && <Due date={report.due} />}
          </>
        )}
      </Typography>
    </Box>
  );
};
