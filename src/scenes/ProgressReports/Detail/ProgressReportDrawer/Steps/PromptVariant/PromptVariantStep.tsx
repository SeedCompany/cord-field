import { SubmissionErrors } from 'final-form';
import {
  HighlightItemEditFragment,
  ProgressReportAvailableDataFragment,
} from '../../ProgressReportDrawer.graphql';
import { PromptsForm } from './PromptsForm';
import { VariantResponsesForm } from './VariantResponsesForm';

interface PromptVariantStepProps {
  currentItem: HighlightItemEditFragment | null;
  reportId: string;
  availableData: ProgressReportAvailableDataFragment | null;

  changePromptMutation?: (
    input: any
  ) => void | SubmissionErrors | Promise<SubmissionErrors>;
  createItemMutation: (
    input: any
  ) => void | SubmissionErrors | Promise<SubmissionErrors>;
  updateResponseMutation: (
    input: any
  ) => void | SubmissionErrors | Promise<SubmissionErrors>;
}

export const PromptVariantStep = ({
  currentItem,
  availableData,
  reportId,
  updateResponseMutation,
  createItemMutation,
}: PromptVariantStepProps) => {
  return (
    <>
      {currentItem ? (
        <VariantResponsesForm
          currentItem={currentItem}
          changeResponseMutation={updateResponseMutation}
        />
      ) : (
        <PromptsForm
          availableData={availableData}
          reportId={reportId}
          createItemMutation={createItemMutation}
        />
      )}
    </>
  );
};
