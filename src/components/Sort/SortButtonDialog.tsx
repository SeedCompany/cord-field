import { Button, Dialog, DialogContent } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useDialog } from '../Dialog';
import { DialogTitle } from '../Dialog/DialogTitle';
import { SortControl, SortControlProps } from './SortControl';

export type SortButtonDialogProps<T> = SortControlProps<T>;

export function SortButtonDialog<T>({
  value,
  onChange,
  children,
}: SortButtonDialogProps<T>) {
  const [state, open] = useDialog();

  // Store value ourselves and sync with prop
  const [current, setCurrent] = useState(value);
  useEffect(() => setCurrent(value), [value]);

  return (
    <>
      <Button variant="outlined" onClick={() => open()}>
        Sort Options
      </Button>
      <Dialog fullWidth maxWidth="xs" {...state}>
        <DialogTitle onClose={state.onClose}>Sort Options</DialogTitle>
        <DialogContent>
          <SortControl
            value={current}
            onChange={(newVal) => {
              // Set current value before closing so change looks to have taken affect
              setCurrent(newVal);
              state.onClose();
              // Allow dialog to render changes and close before
              // preforming navigation
              setImmediate(() => onChange(newVal));
            }}
          >
            {children}
          </SortControl>
        </DialogContent>
      </Dialog>
    </>
  );
}
