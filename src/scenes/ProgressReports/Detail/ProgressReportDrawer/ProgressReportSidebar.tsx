import { InfoOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useDialog } from '~/components/Dialog';
import { useProgressReportContext } from '../../ProgressReportContext';
import { InstructionsDialog } from './InstructionsDialog';
import { ProgressReportStepper } from './ProgressReportStepper';

export const ProgressReportSidebar = () => {
  const { step, currentReport } = useProgressReportContext();
  const [instructionsState, showInstructions] = useDialog();

  const daysLeft = currentReport?.due.toRelative({});

  return (
    <Box
      sx={{
        display: 'initial',
        flexDirection: 'column',
        width: 300,
        padding: 2,
        pt: 4,
        right: 0,
        top: 0,
        position: 'fixed',
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
        color={daysLeft?.includes('ago') ? 'error.dark' : 'info.light'}
        sx={{ marginBottom: 2 }}
      >
        <>
          due {daysLeft}
          <span
            css={(theme) => ({
              marginLeft: theme.spacing(1),
              color: 'black',
            })}
          >
            {currentReport?.due.toFormat('MMM. dd, yyyy')}
          </span>
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
