import { Typography } from '@mui/material';
import { useProgressReportContext } from '../../ProgressReportContext';
import { NextStepButton } from '../NextStepButton';
import { PromptVariantStep } from '../PromptVariant';
import {
  CreateCommunityStoryDocument,
  UpdateCommunityStoryResponseDocument,
} from './CommunityStoryStep.graphql';

export const CommunityStoryStep = () => {
  const { report } = useProgressReportContext();
  const communityStories = report.communityStories;

  return (
    <div
      css={(theme) => ({
        marginBottom: theme.spacing(4),
      })}
    >
      <PromptVariantStep
        reportId={report.id}
        stepData={communityStories}
        updateResponseDocument={UpdateCommunityStoryResponseDocument}
        createItemDocument={CreateCommunityStoryDocument}
        title={
          <Typography variant="h3" gutterBottom>
            Share a story from the community.
          </Typography>
        }
        promptInstructions={
          <Typography variant="body2" gutterBottom>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit
            pharetra enim justo, molestie amet viverra faucibus. Egestas congue
            felis
          </Typography>
        }
      />
      <NextStepButton sx={{ mt: 2 }} />
    </div>
  );
};
