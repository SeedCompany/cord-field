import { Box, Button } from '@mui/material';
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
