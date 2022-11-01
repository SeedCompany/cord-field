import { useProgressReportContext } from '../../../../ProgressReportContext';
import { PromptsForm } from './PromptsForm';
import { VariantResponsesForm } from './VariantResponsesForm';

export const TeamHighlightStep = () => {
  const { currentReport } = useProgressReportContext();
  const currentItem = currentReport?.highlights.items[0] ?? null;

  const stepData = currentReport?.highlights.available;

  return (
    <>
      {currentItem ? (
        <VariantResponsesForm currentItem={currentItem} />
      ) : (
        <PromptsForm stepData={stepData} reportId={currentReport?.id} />
      )}
    </>
  );
};
