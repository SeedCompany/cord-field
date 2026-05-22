import { Box, Card, CardActions, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { SecuredProp, StyleProps } from '~/common';
import { Due, SkippedText } from '../PeriodicReports/OverviewCard/ReportInfo';
import { ReportInfoContainer } from '../PeriodicReports/OverviewCard/ReportInfoContainer';
import { ReportLabel } from '../PeriodicReports/ReportLabel';
import { ButtonLink } from '../Routing';
import { ProgressReportOverviewItemFragment as Report } from './ProgressReportOverview.graphql';

export interface NarrativeReportsOverviewCardProps extends StyleProps {
  dueCurrently?: SecuredProp<Report>;
  dueNext?: SecuredProp<Report>;
}

export const NarrativeReportsOverviewCard = ({
  dueCurrently,
  dueNext,
  ...rest
}: NarrativeReportsOverviewCardProps) => (
  <Card {...rest} sx={{ width: 1 }}>
    <CardContent sx={{ width: 1 }}>
      <Typography variant="h4" paragraph>
        Narrative Reports
      </Typography>
      <ReportInfoContainer horizontalAt={260} spaceEvenlyAt={430}>
        {dueCurrently?.value && (
          <ReportInfo title="Current" report={dueCurrently.value} extra />
        )}
        {dueNext?.value && <ReportInfo title="Next" report={dueNext.value} />}
      </ReportInfoContainer>
    </CardContent>
    <CardActions sx={{ justifyContent: 'flex-end' }}>
      <ButtonLink color="primary" to="reports/narrative">
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
  const skipped = report.skippedReason.value;
  const hasFile = !!report.narrativeFile.value;
  const needsUpload = !hasFile && report.narrativeFile.canEdit && !skipped;
  return (
    <Box {...rest}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" sx={{ my: 1 }}>
        <ReportLabel report={report} />
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {skipped && <SkippedText />}
        {extra && !skipped && (
          <>
            {hasFile ? 'Uploaded' : needsUpload ? 'Awaiting upload' : null}
            {!hasFile && needsUpload && <> &mdash; </>}
            {!hasFile && <Due date={report.due} />}
          </>
        )}
      </Typography>
    </Box>
  );
};
