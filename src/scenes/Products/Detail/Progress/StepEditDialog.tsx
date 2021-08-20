import { useMutation } from '@apollo/client';
import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import { displayProductStep } from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { NumberField, SecuredField } from '../../../../components/form';
import { max } from '../../../../components/form/validators';
import {
  ProductProgressFragment,
  StepProgressFragment,
  UpdateStepProgressDocument,
} from './ProductProgress.generated';

export interface StepFormValues {
  percentDone?: number | null;
}

type StepEditDialogProps = Except<
  DialogFormProps<StepFormValues>,
  'initialValues' | 'onSubmit'
> & {
  progress: ProductProgressFragment;
  step: StepProgressFragment;
};

export const StepEditDialog = ({
  progress,
  step,
  ...props
}: StepEditDialogProps) => {
  const initialValues = useMemo(
    () => ({
      percentDone: step.percentDone.value,
    }),
    [step]
  );
  const [update] = useMutation(UpdateStepProgressDocument);

  return (
    <DialogForm<StepFormValues>
      title={displayProductStep(step.step)}
      {...props}
      initialValues={initialValues}
      onSubmit={async (data) => {
        await update({
          variables: {
            input: {
              productId: progress.product.id,
              reportId: progress.report.id,
              steps: [
                {
                  step: step.step,
                  percentDone: data.percentDone,
                },
              ],
            },
          },
        });
      }}
    >
      <SecuredField obj={step} name="percentDone">
        {(props) => (
          <NumberField
            {...props}
            label="Progress"
            suffix="%"
            validate={max(100)}
          />
        )}
      </SecuredField>
    </DialogForm>
  );
};
