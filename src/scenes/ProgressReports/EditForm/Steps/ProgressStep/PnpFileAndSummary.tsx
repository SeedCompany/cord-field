import { Grid, Typography } from '@mui/material';
import { StyleProps } from '~/common';
import { useDialog } from '~/components/Dialog';
import { UpdatePeriodicReportDialog } from '../../../../Projects/Reports/UpdatePeriodicReportDialog';
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
  // Single file for the new version, empty array for received date update.
  const [dialogState, setUploading, upload] = useDialog<File[]>();

  return (
    <Grid container spacing={2} {...rest}>
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
        {!report.reportFile.value && (
          <Grid item md={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2">
              Please upload the PnP for this reporting period.
              The progress data will populate the charts below.
            </Typography>
          </Grid>
        )}
        <Grid item md={6} justifyItems="end">
          <ProgressReportCard
            progressReport={report}
            disableIcon
            onUpload={({ files }) => setUploading(files)}
          />
          <UpdatePeriodicReportDialog
            {...dialogState}
            report={{ ...report, reportFile: upload }}
            editFields={[
              'receivedDate',
              ...(upload && upload.length > 0 ? ['reportFile' as const] : []),
            ]}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
