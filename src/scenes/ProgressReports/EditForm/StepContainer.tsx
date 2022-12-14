import { Box } from '@mui/material';
import { colorPalette } from './colorPalette';
import { useProgressReportContext } from './ProgressReportContext';
import { ReportProp } from './ReportProp';
import { Steps } from './Steps';
import { NextStepButton } from './Steps/NextStepButton';

const stepMap = Object.fromEntries(Object.values(Steps).flat());

export const StepContainer = ({ report }: ReportProp) => {
  const { stepName } = useProgressReportContext();
  const Step = stepMap[stepName];

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

      <Box sx={{ flex: 1, p: 2 }}>{Step && <Step report={report} />}</Box>
    </div>
  );
};
