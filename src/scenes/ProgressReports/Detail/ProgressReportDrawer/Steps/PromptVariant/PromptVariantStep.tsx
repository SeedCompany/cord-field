import { useMutation } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { ReactNode } from 'react';
import {
  ChoosePrompt,
  UpdatePromptVariantResponse,
} from '~/api/schema.graphql';
import { ProgressReportStepDataFragment } from '../../ProgressReportDrawer.graphql';
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

  title: ReactNode;
  promptInstructions: ReactNode;
}

export const PromptVariantStep = ({
  stepData,
  reportId,
  updateResponseDocument,
  createItemDocument,
  title,
  promptInstructions,
}: PromptVariantStepProps) => {
  const currentItem = stepData?.items[0] ?? null;
  const availableData = stepData?.available ?? null;

  const [updateResponseMutation] = useMutation(updateResponseDocument);
  const [createItemMutation] = useMutation(createItemDocument);

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

  return (
    <div css={(theme) => ({ maxWidth: theme.breakpoints.values.md })}>
      {currentItem ? (
        <VariantResponsesForm
          currentItem={currentItem}
          onChangeResponse={handleUpdateResponse}
          title={title}
        />
      ) : (
        <PromptsForm
          availableData={availableData}
          onCreateItem={handleCreateItem}
          title={title}
          promptInstructions={promptInstructions}
        />
      )}
    </div>
  );
};
