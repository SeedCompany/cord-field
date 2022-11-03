import { Typography } from '@mui/material';
import { SubmissionErrors } from 'final-form';
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
