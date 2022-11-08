import { Box } from '@mui/material';
import { useProgressReportContext } from '../../ProgressReportContext';
import { Step1, Step2, Step3 } from '../TemporarySteps';
import { colorPalette } from './colorPalette';
import { NextStepButton } from './Steps/NextStepButton';
import { TeamHighlightStep } from './Steps/TeamHighlight';

export const StepContainer = () => {
  const { step } = useProgressReportContext();

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

      <Box sx={{ flex: 1, padding: 2, pt: 1 }}>
        {step === 0 && <TeamHighlightStep />}
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
      </Box>
    </div>
  );
};
