import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import { CreateOrganizationInput } from '../../../api';
import { SubmitButton, SubmitError, TextField } from '../../../components/form';

export type CreateOrganizationFormProps = Pick<
  FormProps<CreateOrganizationInput>,
  'onSubmit' | 'initialValues'
> & {
  className?: string;
  open: boolean;
  onClose: () => void;
  close?: boolean;
};

const useStyles = makeStyles(({ spacing }) => ({
  actionContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 400,
    minWidth: 300,
  },
  title: {
    marginBottom: spacing(-1),
    textAlign: 'center',
  },
}));

export const CreateOrganizationForm = ({
  className,
  open,
  onClose,
  close: closeProp,
  ...props
}: CreateOrganizationFormProps) => {
  const close = closeProp ? closeProp : false;
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      disableBackdropClick={close}
      onClose={onClose}
      className={className}
    >
      <DialogTitle className={classes.title}>Create Organization</DialogTitle>
      <DialogContent>
        <Form {...props}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <SubmitError />
              <TextField
                name="organization.name"
                label="Name"
                placeholder="Enter organization name"
              />
              <div className={classes.actionContent}>
                <SubmitButton fullWidth={false} />
                <Button
                  color="secondary"
                  size="large"
                  variant="contained"
                  onClick={onClose}
                  disabled={close}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};
