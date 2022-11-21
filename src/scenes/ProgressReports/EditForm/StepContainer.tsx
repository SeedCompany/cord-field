import { Box } from '@mui/material';
import { colorPalette } from './colorPalette';
import { useProgressReportContext } from './ProgressReportContext';
import { CommunityStoryStep } from './Steps/CommunityStory';
import { NextStepButton } from './Steps/NextStepButton';
import { ProgressStep } from './Steps/ProgressStep';
import { SubmitReportStep } from './Steps/SubmitReportStep';
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
        {step === 1 && <CommunityStoryStep />}
        {step === 2 && <ProgressStep />}
        {step === 3 && <SubmitReportStep />}
      </Box>
    </div>
  );
};
