import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import { displayProductStep, MethodologyStep } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { TextField } from '../../../components/form';

export interface StepFormState {
  step: MethodologyStep;
  percentDone?: number | null;
  description?: string;
}

export interface StepFormValues {
  step: MethodologyStep;
  percentDone?: number | null;
  description?: string;
  isCompletedStep?: boolean;
}

type StepEditDialogProps = Except<
  DialogFormProps<StepFormValues>,
  'initialValues'
> &
  StepFormValues;

export const StepEditDialog = ({
  step,
  percentDone,
  description,
  isCompletedStep,
  ...dialogProps
}: StepEditDialogProps) => {
  const initialValues = useMemo(() => {
    return {
      step: step,
      percentDone: percentDone || 0,
      description: description || '',
    };
  }, [description, percentDone, step]);

  return (
    <DialogForm<StepFormState>
      {...dialogProps}
      title={displayProductStep(step)}
      initialValues={initialValues}
    >
      {() => {
        return (
          <>
            <TextField name="percentDone" label="Progress Percentage" />
            {isCompletedStep && (
              <TextField name="description" label="Description" />
            )}
          </>
        );
      }}
    </DialogForm>
  );
};
