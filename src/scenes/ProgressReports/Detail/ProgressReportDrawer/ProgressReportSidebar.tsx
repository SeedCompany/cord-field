import { InfoOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useDialog } from '~/components/Dialog';
import { InstructionsDialog } from './InstructionsDialog';
import { ProgressReportStepper } from './ProgressReportStepper';

export const ProgressReportSidebar = ({ step }: { step: number }) => {
  const [instructionsState, showInstructions] = useDialog();

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
      <Typography variant="body2" color="info.light" sx={{ marginBottom: 2 }}>
        36 DAYS before due
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
