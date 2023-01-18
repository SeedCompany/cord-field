import { useMutation } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { Edit } from '@mui/icons-material';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { ReactNode, useMemo, useState } from 'react';
import { ChangePrompt, ChoosePrompt } from '~/api/schema.graphql';
import {
  PromptResponseFragment as PromptResponse,
  PromptResponseListFragment as PromptResponseList,
} from '~/common/fragments';
import { IconButton } from '~/components/IconButton';
import { RichTextView } from '~/components/RichText';
import { PromptSelection, PromptsForm, PromptsFormProps } from './PromptsForm';

interface PromptProps {
  reportId: string;
  promptResponse?: PromptResponse;
  list: PromptResponseList;
  createItemDocument: DocumentNode<unknown, { input: ChoosePrompt }>;
  changePromptDocument: DocumentNode<unknown, { input: ChangePrompt }>;
  promptInstructions: ReactNode;
}

export const Prompt = ({
  reportId,
  promptResponse,
  list,
  createItemDocument,
  changePromptDocument,
  promptInstructions,
}: PromptProps) => {
  const [isChangingPrompt, setIsChangingPrompt] = useState(false);

  const [createPromptResponse] = useMutation(createItemDocument);
  const [updatePrompt] = useMutation(changePromptDocument);

  const handleFirstPromptSelection = async (values: PromptSelection) => {
    await createPromptResponse({
      variables: {
        input: {
          prompt: values.prompt,
          resource: reportId,
        },
      },
    });
  };

  const handleUpdatePrompt: PromptsFormProps['onSubmit'] = async (
    values,
    form
  ) => {
    if (!promptResponse) return;
    if (form.getState().dirty) {
      await updatePrompt({
        variables: {
          input: {
            id: promptResponse.id,
            prompt: values.prompt,
          },
        },
      });
    }
    setIsChangingPrompt(false);
  };

  const handlePromptSelection =
    promptResponse || isChangingPrompt
      ? handleUpdatePrompt
      : handleFirstPromptSelection;

  const initialValues = useMemo(
    (): Partial<PromptSelection> => ({
      prompt: promptResponse?.prompt.value?.id,
    }),
    [promptResponse]
  );

  const hasPrompts = list.available.prompts.length > 0;
  const canSetPrompt =
    hasPrompts &&
    (!promptResponse ? list.canCreate : promptResponse.prompt.canEdit);

  if (canSetPrompt && (!promptResponse || isChangingPrompt)) {
    return (
      <PromptsForm
        availablePrompts={list.available.prompts}
        preamble={promptInstructions}
        onSubmit={handlePromptSelection}
        initialValues={initialValues}
        sx={{ mb: 4 }}
      />
    );
  }
  if (!promptResponse) {
    return (
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        Nothing communicated yet
        {!hasPrompts &&
          list.canCreate &&
          ' (no prompts available for selection)'}
      </Typography>
    );
  }
  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={{ mt: 2, mb: 4 }}
    >
      <Box sx={{ '& > *:last-child': { mb: 0 } }}>
        <RichTextView data={promptResponse.prompt.value?.text.value} />
      </Box>
      {canSetPrompt && (
        <Tooltip title="Change Prompt">
          <IconButton onClick={() => setIsChangingPrompt(true)}>
            <Edit />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};
