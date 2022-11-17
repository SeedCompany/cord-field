import { InfoOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useDialog } from '~/components/Dialog';
import { InstructionsDialog } from './InstructionsDialog';
import { useProgressReportContext } from './ProgressReportContext';
import { ProgressReportStepper } from './ProgressReportStepper';

export const ProgressReportSidebar = () => {
  const { step, report } = useProgressReportContext();
  const [instructionsState, showInstructions] = useDialog();

  const daysLeft = report?.due.toRelative({});

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
      <Button
        endIcon={<InfoOutlined />}
        color="secondary"
        onClick={showInstructions}
        sx={{ ml: -1 }}
      >
        Instructions
      </Button>
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
            {report?.due.toLocaleString(DateTime.DATE_MED)}
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
