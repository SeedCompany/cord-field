import { InfoOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useDialog } from '~/components/Dialog';
import { useProgressReportContext } from '../../ProgressReportContext';
import { InstructionsDialog } from './InstructionsDialog';
import { ProgressReportStepper } from './ProgressReportStepper';

export const ProgressReportSidebar = () => {
  const { step, currentReport } = useProgressReportContext();
  const [instructionsState, showInstructions] = useDialog();

  const daysLeft = Math.floor(currentReport?.due.diffNow('days').days ?? 0);

  return (
    <Box
      sx={{
        display: 'initial',
        flexDirection: 'column',
        minWidth: 350,
        padding: 2,
        pt: 4,
      }}
    >
      <Typography
        sx={{
          marginBottom: 1,
          '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline',
          },
        }}
        onClick={showInstructions}
      >
        Instructions{' '}
        <InfoOutlined
          sx={{
            fontSize: 16,
            marginBottom: '-3px',
          }}
        />
      </Typography>
      <Typography
        variant="body2"
        color={daysLeft > 0 ? 'info.light' : 'error.dark'}
        sx={{ marginBottom: 2 }}
      >
        <>
          {Math.abs(daysLeft)} {daysLeft > 0 ? 'DAYS before' : 'DAYS over'} due
        </>
      </Typography>

      <Button
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          '&:disabled': {
            backgroundColor: 'primary.light',
            color: 'white',
          },
          marginBottom: 2,
        }}
        disabled
      >
        Submit Report
      </Button>
      <ProgressReportStepper step={step} />
      <InstructionsDialog {...instructionsState} />
    </Box>
  );
};
