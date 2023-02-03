import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useProgressReportContext } from './ProgressReportContext';
import { ReportProp } from './ReportProp';

export const StepContainer = ({ report }: ReportProp) => {
  const { CurrentStep, previousStep, nextStep, isLast, isFirst } =
    useProgressReportContext();

  const previousButton = !isFirst && (
    <Button
      variant="outlined"
      color="secondary"
      onClick={previousStep}
      startIcon={
        <ArrowBack
          sx={{
            marginBottom: '-3px',
          }}
        />
      }
    >
      Previous
    </Button>
  );

  const nextButton = !isLast && (
    <Button
      variant="outlined"
      color="secondary"
      onClick={nextStep}
      endIcon={
        <ArrowForward
          sx={{
            marginBottom: '-3px',
          }}
        />
      }
    >
      Next
    </Button>
  );

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={[
          (theme) => ({
            display: 'flex',
            justifyContent: 'space-between',
            padding: 1,
            borderBottom: `solid ${theme.palette.divider}`,
            borderWidth: '1px 0',
          }),
          isFirst && {
            justifyContent: 'flex-end',
          },
        ]}
      >
        {previousButton} {nextButton}
      </Box>

      <Box sx={{ p: 2, mb: 2 }}>
        <CurrentStep report={report} />
      </Box>

      <Box
        sx={[
          {
            display: 'flex',
            justifyContent: 'space-between',
            padding: 1,
          },
          isFirst && {
            justifyContent: 'flex-end',
          },
        ]}
      >
        {previousButton} {nextButton}
      </Box>
    </div>
  );
};
