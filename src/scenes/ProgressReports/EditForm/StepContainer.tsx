import { Box } from '@mui/material';
import { useProgressReportContext } from './ProgressReportContext';
import { ReportProp } from './ReportProp';
import { NextStepButton } from './Steps/NextStepButton';

export const StepContainer = ({ report }: ReportProp) => {
  const { CurrentStep, isLast } = useProgressReportContext();

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'end',
          padding: 1,
          border: `solid ${theme.palette.divider}`,
          borderWidth: '1px 0',
        })}
      >
        <NextStepButton />
      </Box>

      <Box sx={{ p: 2, mb: 2 }}>
        <CurrentStep report={report} />
      </Box>

      {!isLast && <NextStepButton sx={{ mr: 2, mb: 2 }} />}
    </div>
  );
};
