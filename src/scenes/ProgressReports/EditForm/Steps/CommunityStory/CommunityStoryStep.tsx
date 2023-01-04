import { Box, Typography } from '@mui/material';
import { useProgressReportContext } from '../../ProgressReportContext';
import { NextStepButton } from '../NextStepButton';
import { Prompt, VariantResponses } from '../PromptVariant';
import {
  ChangeProgressReportCommunityStoryPromptDocument as ChangePrompt,
  CreateCommunityStoryDocument as CreateStory,
  UpdateCommunityStoryResponseDocument as UpdateResponse,
} from './CommunityStoryStep.graphql';

export const CommunityStoryStep = () => {
  const { report } = useProgressReportContext();
  const story = report.communityStories.items[0];

  return (
    <div
      css={(theme) => ({
        marginBottom: theme.spacing(4),
      })}
    >
      <Box sx={{ maxWidth: 'md' }}>
        <Typography variant="h3" gutterBottom>
          Share a story from the community
        </Typography>
        <Prompt
          reportId={report.id}
          list={report.communityStories}
          promptResponse={story}
          createItemDocument={CreateStory}
          changePromptDocument={ChangePrompt}
          promptInstructions={
            <Typography variant="body2" gutterBottom>
              As you reflect on the past three months, select a prompt below to
              answer.
            </Typography>
          }
        />
        <VariantResponses promptResponse={story} doc={UpdateResponse} />
      </Box>
      <NextStepButton sx={{ mt: 2 }} />
    </div>
  );
};
