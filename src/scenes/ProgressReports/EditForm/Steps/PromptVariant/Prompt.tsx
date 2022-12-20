import { useMutation } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { Edit } from '@mui/icons-material';
import { Box, Stack, Tooltip } from '@mui/material';
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
  available: PromptResponseList['available'];
  createItemDocument: DocumentNode<unknown, { input: ChoosePrompt }>;
  changePromptDocument: DocumentNode<unknown, { input: ChangePrompt }>;
  promptInstructions: ReactNode;
}

export const Prompt = ({
  reportId,
  promptResponse,
  available,
  createItemDocument,
  changePromptDocument: updatePromptDocument,
  promptInstructions,
}: PromptProps) => {
  const [isChangingPrompt, setIsChangingPrompt] = useState(false);

  const [createPromptResponse] = useMutation(createItemDocument);
  const [updatePrompt] = useMutation(updatePromptDocument);

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

  if (!promptResponse || isChangingPrompt) {
    return (
      <PromptsForm
        availablePrompts={available.prompts}
        preamble={promptInstructions}
        onSubmit={handlePromptSelection}
        initialValues={initialValues}
        sx={{ mb: 4 }}
      />
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
      {promptResponse.prompt.canEdit && (
        <Tooltip title="Change Prompt">
          <IconButton onClick={() => setIsChangingPrompt(true)}>
            <Edit />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};
