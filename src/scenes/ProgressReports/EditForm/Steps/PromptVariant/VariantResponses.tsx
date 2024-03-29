import { useMutation } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { UpdatePromptVariantResponse } from '~/api/schema/schema.graphql';
import { PromptResponseFragment as PromptResponse } from '~/common/fragments';
import {
  VariantResponsesForm,
  VariantResponsesFormProps,
} from './VariantResponsesForm';

interface VariantResponsesProps
  extends Omit<VariantResponsesFormProps, 'onSubmit' | 'promptResponse'> {
  promptResponse?: PromptResponse;
  doc: DocumentNode<unknown, { input: UpdatePromptVariantResponse }>;
}

export const VariantResponses = ({
  doc,
  promptResponse,
  ...rest
}: VariantResponsesProps) => {
  const [setResponse] = useMutation(doc);

  if (!promptResponse) return null;

  return (
    <VariantResponsesForm
      {...rest}
      promptResponse={promptResponse}
      onSubmit={async (values) => {
        await setResponse({
          variables: {
            input: {
              id: promptResponse.id,
              response: values.response,
              variant: values.variant,
            },
          },
        });
      }}
    />
  );
};
