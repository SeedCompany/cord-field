import { Box } from '@mui/material';
import { colorPalette } from './colorPalette';
import { useProgressReportContext } from './ProgressReportContext';
import { ReportProp } from './ReportProp';
import { CommunityStoryStep } from './Steps/CommunityStory';
import { ExplanationOfProgress } from './Steps/ExplanationOfProgress/ExplanationOfProgress';
import { NextStepButton } from './Steps/NextStepButton';
import { ProgressStep } from './Steps/ProgressStep';
import { SubmitReportStep } from './Steps/SubmitReportStep';
import { TeamHighlightStep } from './Steps/TeamHighlight';

export const StepContainer = ({ report }: ReportProp) => {
  const { step: stepIndex } = useProgressReportContext();

  const Step = [
    TeamHighlightStep,
    CommunityStoryStep,
    ProgressStep,
    ExplanationOfProgress,
    SubmitReportStep,
  ][stepIndex];

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
