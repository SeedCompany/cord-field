import { Typography } from '@mui/material';
import { useProgressReportContext } from '../../../ProgressReportContext';
import { NextStepButton } from '../NextStepButton';
import { PromptVariantStep } from '../PromptVariant';
import {
  CreateProgressReportHighlightDocument,
  UpdateProgressReportHighlightResponseDocument,
} from './TeamHighlightStep.graphql';

export const TeamHighlightStep = () => {
  const { currentReport } = useProgressReportContext();
  const highlights = currentReport?.highlights;

  if (!currentReport) {
    return null;
  }

  return (
    <div
      css={(theme) => ({
        marginBottom: theme.spacing(4),
      })}
    >
      <PromptVariantStep
        stepData={highlights}
        reportId={currentReport.id}
        updateResponseDocument={UpdateProgressReportHighlightResponseDocument}
        createItemDocument={CreateProgressReportHighlightDocument}
        title={
          <Typography variant="h3" gutterBottom>
            Share a team highlight story.
          </Typography>
        }
        promptInstructions={
          <Typography variant="body2" gutterBottom>
            As you reflect on the past three quarters, select ONE question below
            to answer.
          </Typography>
        }
      />
      <NextStepButton sx={{ mt: 2 }} />
    </div>
  );
};
