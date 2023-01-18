import { InfoOutlined } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
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
      <Box mb={2}>
        <ReportDue date={report.due} />
      </Box>
      <ProgressReportStepper />
      <InstructionsDialog {...instructionsState} />
    </Box>
  );
};
