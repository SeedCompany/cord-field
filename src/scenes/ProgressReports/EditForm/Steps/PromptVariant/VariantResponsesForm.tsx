import { Box } from '@mui/material';
import { SubmissionErrors } from 'final-form';
import { ReactNode } from 'react';
import { RichTextView } from '~/components/RichText';
import {
  ProgressReportItemEditFragment,
  ProgressReportItemResponseEditFragment,
} from '../../ProgressReportEdit.graphql';
import { VariantResponsesAccordion } from './VariantResponsesAccordion';

interface VariantResponsesFormProps {
  currentItem: ProgressReportItemEditFragment;
  onChangeResponse?: (
    input: any
  ) => void | SubmissionErrors | Promise<SubmissionErrors>;
  title?: ReactNode;
  viewOnly?: boolean;
}

export const VariantResponsesForm = ({
  currentItem,
  onChangeResponse,
  title,
  viewOnly,
}: VariantResponsesFormProps) => {
  const reversed = currentItem.responses.slice().reverse();

  return (
    <>
      {title}
      {currentItem.prompt.value?.text.value && (
        <Box sx={{ mt: 2, mb: 4 }}>
          <RichTextView data={currentItem.prompt.value.text.value} />
        </Box>
      )}
      {reversed.map(
        (response: ProgressReportItemResponseEditFragment, index) => (
          <VariantResponsesAccordion
            response={response}
            expanded={index === 0}
            key={response.variant.key}
            onSubmit={onChangeResponse}
            viewOnly={viewOnly}
          />
        )
      )}
    </>
  );
};
