import { useMutation } from '@apollo/client';
import { Alert } from '@material-ui/lab';
import { isBoolean } from 'lodash';
import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import { displayProductStep, ProgressMeasurement } from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import {
  CheckboxField,
  NumberField,
  SecuredField,
} from '../../../../components/form';
import { max } from '../../../../components/form/validators';
import {
  ProductProgressFragment,
  StepProgressFragment,
  UpdateStepProgressDocument,
} from './ProductProgress.generated';

export interface StepFormValues {
  completed?: number | boolean | null;
}

type StepEditDialogProps = Except<
  DialogFormProps<StepFormValues>,
  'initialValues' | 'onSubmit'
> & {
  progress: ProductProgressFragment;
  step: StepProgressFragment;
  measurement: ProgressMeasurement;
  target: number;
};

export const StepEditDialog = ({
  progress,
  step,
  measurement,
  target,
  ...props
}: StepEditDialogProps) => {
  const initialValues = useMemo(
    () => ({
      completed:
        measurement === 'Boolean'
          ? !!step.completed.value
          : step.completed.value,
    }),
    [measurement, step.completed.value]
  );
  const [update] = useMutation(UpdateStepProgressDocument);

  return (
    <DialogForm<StepFormValues>
      title={displayProductStep(step.step)}
      {...props}
      initialValues={initialValues}
      onSubmit={async (data) => {
        const completed = isBoolean(data.completed)
          ? +data.completed
          : data.completed;
        await update({
          variables: {
            input: {
              productId: progress.product.id,
              reportId: progress.report.id,
              steps: [
                {
                  step: step.step,
                  completed,
                },
              ],
            },
          },
        });
      }}
      errorHandlers={{
        Unauthorized: {
          completed:
            "You do not have permission to update this step's progress",
        },
      }}
    >
      <Alert severity="warning">
        Changes will not be applied to the PnP file
      </Alert>
      <SecuredField obj={step} name="completed">
        {(props) =>
          measurement === 'Boolean' ? (
            <CheckboxField label="Completed?" {...props} />
          ) : (
            <NumberField
              {...props}
              label="Progress"
              helperText={
                measurement === 'Number' ? `Target is ${target}` : undefined
              }
              maximumFractionDigits={4}
              suffix={measurement === 'Percent' ? '%' : undefined}
              validate={max(target)}
            />
          )
        }
      </SecuredField>
    </DialogForm>
  );
};
