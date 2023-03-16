import { Typography } from '@mui/material';
import { SecuredPeriodicReportFragment } from '../PeriodicReport.graphql';
import { ReportLabel } from '../ReportLabel';

export const ReportFileDropInfo = ({
  report,
}: {
  report?: SecuredPeriodicReportFragment;
}) => {
  const file = report?.value?.reportFile;
  return (
    <Typography variant="h4">
      {file && (!file.canEdit || !file.canRead) ? (
        <>You do not have permission to upload report file</>
      ) : report && file ? (
        <>
          <em>
            <ReportLabel report={report} /> {report.value.type} Report
          </em>
          <br />
          Drop here to upload
          {file.value ? ' an updated version' : ''}
        </>
      ) : (
        <>No report currently due</>
      )}
    </Typography>
  );
};
