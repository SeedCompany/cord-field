import { Box } from '@mui/material';
import { useProgressReportContext } from './ProgressReportContext';
import { ReportProp } from './ReportProp';
import { NextStepButton } from './Steps/NextStepButton';
import { PreviousStepButton } from './Steps/PreviousStepButton';

export const StepContainer = ({ report }: ReportProp) => {
  const { CurrentStep, isLast, isFirst } = useProgressReportContext();

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
        {!isFirst && <PreviousStepButton />}
        {!isLast && <NextStepButton />}
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
        {!isFirst && <PreviousStepButton sx={{ mr: 1, mb: 2 }} />}
        {!isLast && <NextStepButton sx={{ mr: 1, mb: 2 }} />}
      </Box>
    </div>
  );
};
