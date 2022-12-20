import { useMutation } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { Box } from '@mui/material';
import { ReactNode, useState } from 'react';
import {
  ChangePrompt,
  ChoosePrompt,
  UpdatePromptVariantResponse,
} from '~/api/schema.graphql';
import { ProgressReportStepDataFragment } from '../../ProgressReportEdit.graphql';
import { PromptsForm } from './PromptsForm';
import { VariantResponsesForm } from './VariantResponsesForm';

interface PromptVariantStepProps {
  stepData?: ProgressReportStepDataFragment;
  reportId: string;
  updateResponseDocument: DocumentNode<
    unknown,
    { input: UpdatePromptVariantResponse }
  >;
  createItemDocument: DocumentNode<unknown, { input: ChoosePrompt }>;
  changePromptDocument: DocumentNode<unknown, { input: ChangePrompt }>;

  title: ReactNode;
  promptInstructions: ReactNode;
}

export const PromptVariantStep = ({
  stepData,
  reportId,
  updateResponseDocument,
  createItemDocument,
  changePromptDocument: updatePromptDocument,
  title,
  promptInstructions,
}: PromptVariantStepProps) => {
  const currentItem = stepData?.items[0] ?? null;
  const availableData = stepData?.available ?? null;

  const [isChangingPrompt, setIsChangingPrompt] = useState(false);

  const [updateResponseMutation] = useMutation(updateResponseDocument);
  const [createItemMutation] = useMutation(createItemDocument);
  const [updatePrompt] = useMutation(updatePromptDocument);

  const handleUpdateResponse = async (values: any) => {
    await updateResponseMutation({
      variables: {
        input: {
          id: currentItem?.id ?? '',
          response: values.response,
          variant: values.variant,
        },
      },
    });
  };

  const handleCreateItem = async (values: any) => {
    await createItemMutation({
      variables: {
        input: {
          prompt: values.prompt,
          resource: reportId,
        },
      },
    });
  };

  const handleUpdatePrompt = async (values: any) => {
    await updatePrompt({
      variables: {
        input: {
          id: currentItem?.id ?? '',
          prompt: values.prompt,
        },
      },
    });
    setIsChangingPrompt(false);
  };

  const handleFormSubmitted = (values: any) => {
    if (currentItem || isChangingPrompt) {
      return handleUpdatePrompt(values);
    }
    return handleCreateItem(values);
  };

  console.log('currentItem', currentItem);
  console.log('isChangingPrompt', isChangingPrompt);

  return (
    <Box sx={{ maxWidth: 'md' }}>
      {currentItem && !isChangingPrompt ? (
        <VariantResponsesForm
          currentItem={currentItem}
          onChangeResponse={handleUpdateResponse}
          onUpdatePromptClick={(value) => setIsChangingPrompt(value)}
          title={title}
        />
      ) : (
        <PromptsForm
          availableData={availableData}
          title={title}
          promptInstructions={promptInstructions}
          onFormSubmitted={handleFormSubmitted}
        />
      )}
    </Box>
  );
};
