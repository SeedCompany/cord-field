import { useMutation } from '@apollo/client';
import { Alert } from '@mui/material';
import { useMemo } from 'react';
import { Except } from 'type-fest';
import { ProductStepLabels, ProgressMeasurement } from '~/api/schema.graphql';
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
} from './ProductProgress.graphql';

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
      title={ProductStepLabels[step.step]}
      {...props}
      initialValues={initialValues}
      onSubmit={async (data) => {
        const completed =
          typeof data.completed === 'boolean'
            ? +data.completed
            : data.completed;
        await update({
          variables: {
            input: {
              product: progress.product.id,
              report: progress.report.id,
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
