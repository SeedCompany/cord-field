import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import { MethodologyStep } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { TextField } from '../../../components/form';

export interface StepFormState {
  name: MethodologyStep;
  percentDone?: number | null;
  description?: string;
}

export interface StepDialogValues {
  id: string;
  previousValue: number;
  newValue: number;
  description: string;
  name: string;
}

type StepEditDialogProps = Except<
  DialogFormProps<StepDialogValues>,
  'initialValues'
> &
  StepFormState;

export const StepEditDialog = ({
  name,
  percentDone,
  description,
  ...dialogProps
}: StepEditDialogProps) => {
  const initialValues = useMemo(() => {
    return {
      name: name,
      previousValue: percentDone || 0,
      description: description || '',
    };
  }, [description, name, percentDone]);

  return (
    <DialogForm<StepDialogValues>
      {...dialogProps}
      title={name}
      initialValues={initialValues}
    >
      {() => {
        return (
          <>
            <TextField
              disabled
              name="previousValue"
              label="Current Progress Percentage"
            />
            <TextField name="newValue" label="New Progress Percentage" />
            <TextField name="description" label="Description" />
          </>
        );
      }}
    </DialogForm>
  );
};
