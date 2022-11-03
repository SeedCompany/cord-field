import { Box, Typography } from '@mui/material';
import { SubmissionErrors } from 'final-form';
import { RichTextView } from '~/components/RichText';
import {
  HighlightItemEditFragment,
  HighlightItemResponseEditFragment,
} from '../../ProgressReportDrawer.graphql';
import { VariantResponsesAccordion } from './VariantResponsesAccordion';

interface VariantResponsesFormProps {
  currentItem: HighlightItemEditFragment;
  changeResponseMutation: (
    input: any
  ) => void | SubmissionErrors | Promise<SubmissionErrors>;
}

export const VariantResponsesForm = ({
  currentItem,
  changeResponseMutation,
}: VariantResponsesFormProps) => {
  return (
    <>
      <Typography variant="h3">Share a team highlight story.</Typography>
      {currentItem.prompt.text.value && (
        <Box sx={{ mt: 2, mb: 4 }}>
          <RichTextView data={currentItem.prompt.text.value} />
        </Box>
      )}
      {currentItem.responses.map(
        (response: HighlightItemResponseEditFragment) => (
          <VariantResponsesAccordion
            response={response}
            expanded
            key={response.variant.key}
            onSubmit={changeResponseMutation}
          />
        )
      )}
    </>
  );
};
