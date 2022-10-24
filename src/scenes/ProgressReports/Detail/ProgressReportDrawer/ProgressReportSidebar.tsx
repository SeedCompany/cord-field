import { InfoOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { ProgressReportFragment } from '../ProgressReportDetail.graphql';
import { ProgressReportStepper } from './ProgressReportStepper';

export const ProgressReportSidebar = ({
  report,
  step,
}: {
  report?: ProgressReportFragment;
  step: number;
}) => {
  if (!report) {
    return null;
  }

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
        }}
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
      <Typography
        sx={{
          marginBottom: 2,
          fontSize: '0.75rem',
          color: 'text.gray',
        }}
      >
        Button enabled once all the fields are filled out
      </Typography>

      <ProgressReportStepper step={step} />
    </Box>
  );
};
