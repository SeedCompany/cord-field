import { Grid, Typography } from '@mui/material';
import { StyleProps } from '~/common';
import { ProgressReportCard } from '../../../Detail/ProgressReportCard';
import { ProgressSummaryCard } from '../../../Detail/ProgressSummaryCard';
import { ProgressReportEditFragment } from '../../ProgressReportEdit.graphql';

interface PnpFileAndSummaryParams extends StyleProps {
  report: ProgressReportEditFragment;
}

export const PnpFileAndSummary = ({
  report,
  ...rest
}: PnpFileAndSummaryParams) => {
  return (
    <Grid container spacing={2} {...rest}>
      <Grid item>
        <Typography variant="h3">Progress</Typography>
      </Grid>
      {report.cumulativeSummary ? (
        <Grid item md={6}>
          <ProgressSummaryCard
            loading={false}
            summary={report.cumulativeSummary}
            sx={{ height: 1 }}
          />
        </Grid>
      ) : null}
      <Grid container item md={report.cumulativeSummary ? 6 : 12} spacing={2}>
        <Grid item md={6} justifyItems="end">
          {!report.reportFile.value && report.reportFile.canEdit && (
            <Typography variant="body2" paragraph>
              Please upload the PnP for this reporting period. The progress data
              will populate the table below.
            </Typography>
          )}
          <ProgressReportCard progressReport={report} disableIcon />
        </Grid>
      </Grid>
    </Grid>
  );
};
