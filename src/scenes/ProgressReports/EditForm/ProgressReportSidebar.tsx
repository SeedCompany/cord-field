import { InfoOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useDialog } from '~/components/Dialog';
import { InstructionsDialog } from './InstructionsDialog';
import { useProgressReportContext } from './ProgressReportContext';
import { ProgressReportStepper } from './ProgressReportStepper';
import { ReportProp } from './ReportProp';

export const ProgressReportSidebar = ({ report }: ReportProp) => {
  const { step } = useProgressReportContext();
  const [instructionsState, showInstructions] = useDialog();

  const daysLeft = report.due.toRelative({});

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
            {report.due.toLocaleString(DateTime.DATE_MED)}
          </span>
        </>
      </Typography>
      <ProgressReportStepper step={step} />
      <InstructionsDialog {...instructionsState} />
    </Box>
  );
};
