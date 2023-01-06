import { Box } from '@mui/material';
import { colorPalette } from './colorPalette';
import { useProgressReportContext } from './ProgressReportContext';
import { ReportProp } from './ReportProp';
import { Steps } from './Steps';
import { NextStepButton } from './Steps/NextStepButton';

const stepMap = Object.fromEntries(Object.values(Steps).flat());

export const StepContainer = ({ report }: ReportProp) => {
  const { stepName, step: stepIndex } = useProgressReportContext();
  const Step = stepMap[stepName];
  const isLastStep = stepIndex >= Object.keys(stepMap).length - 1;

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          padding: 1,
          borderTop: `1px solid ${colorPalette.header.border}`,
          borderBottom: `1px solid ${colorPalette.header.border}`,
        }}
      >
        <NextStepButton />
      </Box>

      <Box sx={{ p: 2, mb: 2 }}>{Step && <Step report={report} />}</Box>

      {!isLastStep && <NextStepButton sx={{ mr: 2, mb: 2 }} />}
    </div>
  );
};
