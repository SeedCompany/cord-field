import { Badge, Button } from '@material-ui/core';
import { ReactNode } from 'react';
import { keys } from '~/common';
import { useDialog } from '../Dialog';
import { DialogForm } from '../Dialog/DialogForm';

export interface FilterButtonDialogProps<T> {
  values: Partial<T>;
  onChange: (val: Partial<T>) => void;
  children: ReactNode;
}

export function FilterButtonDialog<T>({
  values,
  onChange,
  children,
}: FilterButtonDialogProps<T>) {
  const [state, open] = useDialog();

  return (
    <>
      <Badge badgeContent={keys(values).length} color="primary">
        <Button variant="outlined" onClick={() => open()}>
          Filter Options
        </Button>
      </Badge>

      <DialogForm
        {...state}
        title="Filter Options"
        closeLabel="Reset Filters"
        submitLabel="Apply Filters"
        initialValues={values}
        onSubmit={(newValues, form) => {
          if (form.getState().dirty) {
            onChange(newValues);
          }
          state.onClose();
        }}
        onClose={(reason) => {
          if (reason === 'cancel') {
            onChange({});
          }
          state.onClose();
        }}
      >
        {children}
      </DialogForm>
    </>
  );
}
