import React from 'react';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';

export type CreateOrganizationFormProps<T, R = void> = DialogFormProps<T, R>;

export const CreateOrganizationForm = <T, R = void>(
  props: CreateOrganizationFormProps<T, R>
) => (
  <DialogForm {...props} title="Create Partner">
    <SubmitError />
    <TextField
      name="organization.name"
      label="Name"
      placeholder="Enter partner name"
      required
    />
  </DialogForm>
);
