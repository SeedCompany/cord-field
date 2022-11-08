import { Box, Typography } from '@mui/material';
import { SubmissionErrors } from 'final-form';
import { RichTextView } from '~/components/RichText';
import {
  ProgressReportItemEditFragment,
  ProgressReportItemResponseEditFragment,
} from '../../ProgressReportDrawer.graphql';
import { VariantResponsesAccordion } from './VariantResponsesAccordion';

interface VariantResponsesFormProps {
  currentItem: ProgressReportItemEditFragment;
  onChangeResponse: (
    input: any
  ) => void | SubmissionErrors | Promise<SubmissionErrors>;
}

export const VariantResponsesForm = ({
  currentItem,
  onChangeResponse,
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
        (response: ProgressReportItemResponseEditFragment) => (
          <VariantResponsesAccordion
            response={response}
            expanded
            key={response.variant.key}
            onSubmit={onChangeResponse}
          />
        )
      )}
    </>
  );
};
