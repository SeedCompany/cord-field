import { useMutation } from '@apollo/client';
import { Star, StarBorder } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { simpleSwitch } from '@seedcompany/common';
import { useState } from 'react';
import {
  PromptResponseFragment,
  PromptResponseListFragment,
} from '~/common/fragments';
import { RichTextView } from '~/components/RichText';
import { VariantResponses } from '../PromptVariant';
import { PromptSelection, PromptsForm } from '../PromptVariant/PromptsForm';
import { StepComponent } from '../step.types';
import {
  CreateCommunityStoryDocument as CreateStory,
  FeatureCommunityStoryDocument as FeatureStory,
  UpdateCommunityStoryResponseDocument as UpdateResponse,
} from './CommunityStoryStep.graphql';
import { StoryFieldOperationsText, StoryPartnerText } from './Instructions';

/**
 * A report can hold several community stories — one per prompt — but only one
 * should represent it to investors. That selection is a separate act from
 * writing: any story can be featured regardless of who wrote it or when, and
 * featuring one always un-features whichever story held it before, enforced
 * atomically on the server rather than trusted to the UI.
 */
export const CommunityStoryStep: StepComponent = ({ report }) => {
  const stories = report.communityStories;

  return (
    <Box sx={{ maxWidth: 'md', mb: 4 }}>
      <Typography variant="h3" gutterBottom>
        Share stories from the community
      </Typography>
      <Stack spacing={3} sx={{ mb: 3 }}>
        {stories.items.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </Stack>
      <AddAnotherStory reportId={report.id} list={stories} />
    </Box>
  );
};

CommunityStoryStep.enableWhen = ({ report }) => report.communityStories.canRead;

CommunityStoryStep.isIncomplete = ({ report, currentUserRoles }) => ({
  isIncomplete:
    report.communityStories.items.length === 0 ||
    report.communityStories.items.some((story) =>
      story.responses.some(
        ({ variant: { responsibleRole }, response }) =>
          (responsibleRole ? currentUserRoles.has(responsibleRole) : false) &&
          !response.value &&
          response.canEdit
      )
    ),
  severity: 'suggested',
});

const StoryCard = ({ story }: { story: PromptResponseFragment }) => {
  const [feature, { loading }] = useMutation(FeatureStory);
  const featured = story.featured.value ?? false;
  const promptText = story.prompt.value?.text.value;

  return (
    <Card variant="outlined" elevation={0}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" component="div">
            {promptText ? (
              <RichTextView data={promptText} />
            ) : (
              'Prompt unavailable'
            )}
          </Typography>
          {featured ? (
            <Chip
              icon={<Star fontSize="small" />}
              label="Featured for investors"
              color="primary"
              size="small"
              sx={{ flexShrink: 0 }}
            />
          ) : story.featured.canEdit ? (
            <Tooltip title="Use this story for the investor report">
              <Button
                size="small"
                startIcon={<StarBorder fontSize="small" />}
                disabled={loading}
                onClick={() => void feature({ variables: { id: story.id } })}
                sx={{ flexShrink: 0 }}
              >
                Feature
              </Button>
            </Tooltip>
          ) : null}
        </Box>
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
      </CardContent>
    </Card>
  );
};

/**
 * A dedicated add flow rather than reusing `<Prompt>`: that component's
 * create/change-prompt duality is built around a single item per parent, and
 * here every story stays addable independently — there's no "the" item whose
 * prompt gets changed.
 */
const AddAnotherStory = ({
  reportId,
  list,
}: {
  reportId: string;
  list: PromptResponseListFragment;
}) => {
  const [adding, setAdding] = useState(false);
  const [createStory] = useMutation(CreateStory);

  const usedPromptIds = new Set(
    list.items.map((item) => item.prompt.value?.id).filter(Boolean)
  );
  const availablePrompts = list.available.prompts.filter(
    (prompt) => !usedPromptIds.has(prompt.id)
  );

  if (!list.canCreate || availablePrompts.length === 0) {
    return null;
  }

  if (!adding) {
    return (
      <Button variant="outlined" onClick={() => setAdding(true)}>
        Add Another Story
      </Button>
    );
  }

  const handleSubmit = async (values: PromptSelection) => {
    await createStory({
      variables: { input: { resource: reportId, prompt: values.prompt } },
    });
    setAdding(false);
  };

  return (
    <PromptsForm
      availablePrompts={availablePrompts}
      preamble={
        <Typography variant="body2" gutterBottom>
          Select a prompt for the next story.
        </Typography>
      }
      onSubmit={handleSubmit}
      onCleanSubmit={() => setAdding(false)}
    />
  );
};
