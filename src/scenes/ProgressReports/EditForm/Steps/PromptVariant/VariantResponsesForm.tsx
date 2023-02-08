import { ReactNode, useMemo } from 'react';
import { PromptResponseFragment as PromptResponse } from '~/common/fragments';
import {
  VariantResponsesAccordion,
  VariantResponsesAccordionProps,
} from './VariantResponsesAccordion';

export interface VariantResponsesFormProps
  extends Pick<VariantResponsesAccordionProps, 'onSubmit'> {
  promptResponse: PromptResponse;
  instructions?: (variantKey: string) => ReactNode;
}

export const VariantResponsesForm = ({
  promptResponse,
  instructions,
  ...rest
}: VariantResponsesFormProps) => {
  const { responses, expanded } = useMemo(() => {
    const responses = promptResponse.responses;
    if (responses.length === 0) {
      return { responses: [], expanded: new Set<string>() };
    }
    const firstEmpty =
      findIndex(responses, (r) => !r.response.value) ?? responses.length - 1;
    const prevFromEmpty = Math.max(firstEmpty - 1, 0);
    return {
      responses: responses.slice().reverse(),
      expanded: new Set([
        responses[firstEmpty]!.variant.key,
        responses[prevFromEmpty]!.variant.key,
      ]),
    };
  }, [promptResponse.responses]);

  return (
    <>
      {responses.map((response) => (
        <VariantResponsesAccordion
          response={response}
          expanded={expanded.has(response.variant.key)}
          key={response.variant.key}
          instructions={instructions?.(response.variant.key)}
          {...rest}
        />
      ))}
    </>
  );
};

const findIndex = <T,>(
  array: readonly T[],
  predicate: (item: T) => boolean
) => {
  const index = array.findIndex(predicate);
  return index === -1 ? null : index;
};
