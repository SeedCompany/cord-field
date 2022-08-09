import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { sleep } from '../../util';
import { SubmitError, TextField } from '../form';
import { DialogForm as DF } from './DialogForm';
import { useDialog } from './useDialog';

export default {
  title: 'Components/Dialog',
};

interface FormState {
  name?: string;
}

export const Form = () => {
  const [dialog, open] = useDialog();
  useEffect(open, [open]);
  const [state, setState] = useState<FormState>({ name: 'Bob' });

  return (
    <>
      <Button color="primary" variant="contained" onClick={open}>
        Open Dialog
      </Button>
      <DF<FormState>
        title="Change Name"
        initialValues={state}
        onSubmit={async (data) => {
          await sleep(1000);
          if (state.name === data.name) {
            throw new Error('My fake API error');
          }
          setState(data);
        }}
        errorHandlers={{
          Server: 'Change your name',
        }}
        leftAction={
          <Button
            onClick={() => {
              setState({});
              dialog.onClose();
            }}
          >
            Clear Name
          </Button>
        }
        {...dialog}
      >
        <SubmitError />
        <TextField name="name" label="Name" />
      </DF>
    </>
  );
};
