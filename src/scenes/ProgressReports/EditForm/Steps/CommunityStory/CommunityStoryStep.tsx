import { Box, Typography } from '@mui/material';
import { simpleSwitch } from '@seedcompany/common';
import { Prompt, VariantResponses } from '../PromptVariant';
import { StepComponent } from '../step.types';
import {
  ChangeProgressReportCommunityStoryPromptDocument as ChangePrompt,
  CreateCommunityStoryDocument as CreateStory,
  UpdateCommunityStoryResponseDocument as UpdateResponse,
} from './CommunityStoryStep.graphql';
import { StoryFieldOperationsText, StoryPartnerText } from './Instructions';

export const CommunityStoryStep: StepComponent = ({ report }) => {
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
        <VariantResponses
          promptResponse={story}
          doc={UpdateResponse}
          instructions={(variant) =>
            simpleSwitch(variant, {
              draft: <StoryPartnerText />,
              fpm: <StoryFieldOperationsText />,
            })
          }
        />
      </Box>
    </div>
  );
};
CommunityStoryStep.enableWhen = ({ report }) => report.communityStories.canRead;

CommunityStoryStep.isIncomplete = ({ report, currentUserRoles }) => ({
  isIncomplete:
    report.communityStories.items[0]?.responses.some(
      ({ variant: { responsibleRole }, response }) =>
        // responsible
        (responsibleRole ? currentUserRoles.has(responsibleRole) : false) &&
        // empty and editable
        !response.value &&
        response.canEdit
    ) ?? true,
  severity: 'suggested',
});
