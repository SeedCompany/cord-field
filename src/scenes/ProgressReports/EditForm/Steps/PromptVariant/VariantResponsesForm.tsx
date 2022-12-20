import { Box, Button } from '@mui/material';
import { SubmissionErrors } from 'final-form';
import { ReactNode, useMemo } from 'react';
import { RichTextView } from '~/components/RichText';
import { ProgressReportItemEditFragment } from '../../ProgressReportEdit.graphql';
import { VariantResponsesAccordion } from './VariantResponsesAccordion';

interface VariantResponsesFormProps {
  currentItem: ProgressReportItemEditFragment;
  onChangeResponse: (
    input: any
  ) => void | SubmissionErrors | Promise<SubmissionErrors>;
  onUpdatePromptClick: (value: boolean) => void;
  title: ReactNode;
}

export const VariantResponsesForm = ({
  currentItem,
  onChangeResponse,
  onUpdatePromptClick,
  title,
}: VariantResponsesFormProps) => {
  const { responses, expanded } = useMemo(() => {
    const responses = currentItem.responses;
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
  }, [currentItem.responses]);

  return (
    <>
      {title}
      {currentItem.prompt.value?.text.value && (
        <Box sx={{ mt: 2, mb: 4 }}>
          <RichTextView data={currentItem.prompt.value.text.value} />
          <Button
            variant="text"
            size="small"
            onClick={() => onUpdatePromptClick(true)}
          >
            Change prompt
          </Button>
        </Box>
      )}
      {responses.map((response) => (
        <VariantResponsesAccordion
          response={response}
          expanded={expanded.has(response.variant.key)}
          key={response.variant.key}
          onSubmit={onChangeResponse}
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
