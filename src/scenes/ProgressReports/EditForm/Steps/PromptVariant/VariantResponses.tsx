import { useMutation } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { UpdatePromptVariantResponse } from '~/api/schema/schema.graphql';
import { PromptResponseFragment as PromptResponse } from '~/common/fragments';
import { VariantResponsesForm } from './VariantResponsesForm';

interface VariantResponsesProps {
  promptResponse?: PromptResponse;
  doc: DocumentNode<unknown, { input: UpdatePromptVariantResponse }>;
}

export const VariantResponses = ({
  doc,
  promptResponse,
}: VariantResponsesProps) => {
  const [setResponse] = useMutation(doc);

  if (!promptResponse) return null;

  return (
    <VariantResponsesForm
      promptResponse={promptResponse}
      onSubmit={async (values, form) => {
        if (form.getState().dirty) {
          await setResponse({
            variables: {
              input: {
                id: promptResponse.id,
                response: values.response,
                variant: values.variant,
              },
            },
          });
        }
      }}
    />
  );
};
