import React from 'react';
import { CreateOrganizationInput } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';

export type CreateOrganizationFormProps = DialogFormProps<
  CreateOrganizationInput
>;

export const CreateOrganizationForm = (props: CreateOrganizationFormProps) => (
  <DialogForm
    DialogProps={{
      fullWidth: true,
      maxWidth: 'xs',
    }}
    {...props}
    title="Create Organization"
  >
    <SubmitError />
    <TextField
      name="organization.name"
      label="Name"
      placeholder="Enter organization name"
      autoFocus
    />
  </DialogForm>
);
