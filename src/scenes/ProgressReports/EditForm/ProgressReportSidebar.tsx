import { Box, Chip } from '@mui/material';
import { ProgressReportStatusLabels as StatusLabels } from '~/api/schema/enumLists';
import { InstructionsButton } from './InstructionsDialog';
import { ProgressReportStepper } from './ProgressReportStepper';
import { ReportDue } from './ReportDue';
import { ReportProp } from './ReportProp';

export const ProgressReportSidebar = ({ report }: ReportProp) => {
  return (
    <Box
      sx={{
        display: 'initial',
        flexDirection: 'column',
        width: 300,
        padding: 2,
        right: 0,
        top: 0,
        position: 'fixed',
      }}
    >
      <InstructionsButton sx={{ ml: -1 }} />

      {report.status.value && (
        <Box my={1}>
          <Chip color="info" label={StatusLabels[report.status.value]!} />
        </Box>
      )}

      <Box mb={2}>
        <ReportDue date={report.due} />
      </Box>
      <ProgressReportStepper />
    </Box>
  );
};
