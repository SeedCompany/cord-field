import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { TextField } from '../../../components/form';

export interface StepFormState {
  id?: string;
  name: string;
  progress?: number | null;
  description?: string | null;
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
  id,
  name,
  progress,
  description,
  ...dialogProps
}: StepEditDialogProps) => {
  const initialValues = useMemo(() => {
    return {
      id: id,
      name: name,
      previousValue: progress || 0,
      description: description || '',
    };
  }, [description, id, name, progress]);

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
