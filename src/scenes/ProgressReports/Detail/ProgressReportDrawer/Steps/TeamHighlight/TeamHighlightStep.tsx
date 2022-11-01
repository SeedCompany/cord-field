import { useMutation } from '@apollo/client';
import { useProgressReportContext } from '../../../../ProgressReportContext';
import { NextStepButton } from '../NextStepButton';
import { PromptVariantStep } from '../PromptVariant';
import {
  CreateProgressReportHighlightDocument,
  UpdateProgressReportHighlightResponseDocument,
} from './TeamHighlightStep.graphql';

export const TeamHighlightStep = () => {
  const { currentReport } = useProgressReportContext();
  const currentItem = currentReport?.highlights.items[0] ?? null;

  const stepData = currentReport?.highlights.available ?? null;

  const [submitResponse] = useMutation(
    UpdateProgressReportHighlightResponseDocument
  );
  const [createProgressReportHighlight] = useMutation(
    CreateProgressReportHighlightDocument
  );

  const changeResponse = async (values: any) => {
    await submitResponse({
      variables: {
        input: {
          id: currentItem?.id ?? '',
          response: {
            version: '2.24.3',
            time: 1667231018164,
            blocks: [
              {
                id: 'YeoJuo6IPP',
                type: 'paragraph',
                data: {
                  text: values.response,
                },
              },
            ],
          },
          variant: values.variant,
        },
      },
    });
  };

  const createHighlight = async (values: any) => {
    await createProgressReportHighlight({
      variables: {
        input: {
          prompt: values.prompt,
          resource: values.reportId,
        },
      },
    });
  };

  if (!currentReport) {
    return null;
  }

  return (
    <div
      css={(theme) => ({
        marginBottom: theme.spacing(4),
      })}
    >
      <PromptVariantStep
        currentItem={currentItem}
        reportId={currentReport.id ?? ''}
        availableData={stepData}
        updateResponseMutation={changeResponse}
        createItemMutation={createHighlight}
      />
      <NextStepButton />
    </div>
  );
};
