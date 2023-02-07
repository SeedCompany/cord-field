import { InfoOutlined } from '@mui/icons-material';
import { Box, Button, Chip } from '@mui/material';
import { ProgressReportStatusLabels as StatusLabels } from '~/api/schema/enumLists';
import { useDialog } from '~/components/Dialog';
import { InstructionsDialog } from './InstructionsDialog';
import { ProgressReportStepper } from './ProgressReportStepper';
import { ReportDue } from './ReportDue';
import { ReportProp } from './ReportProp';

export const ProgressReportSidebar = ({ report }: ReportProp) => {
  const [instructionsState, showInstructions] = useDialog();

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
      <Button
        endIcon={<InfoOutlined />}
        color="secondary"
        onClick={showInstructions}
        sx={{ ml: -1 }}
      >
        Instructions
      </Button>

      {report.status.value && (
        <Box my={1}>
          <Chip color="info" label={StatusLabels[report.status.value]!} />
        </Box>
      )}

      <Box mb={2}>
        <ReportDue date={report.due} />
      </Box>
      <ProgressReportStepper />
      <InstructionsDialog {...instructionsState} />
    </Box>
  );
};
