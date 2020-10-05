import React from 'react';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../components/form';
import { OrganizationField } from '../../../components/form/Lookup';

export type CreatePartnerFormProps<T, R = void> = DialogFormProps<T, R>;

export const CreatePartnerForm = <T, R = void>(
  props: CreatePartnerFormProps<T, R>
) => (
  <DialogForm {...props} title="Create Partner">
    <SubmitError />
    <OrganizationField
      name="orgLookup"
      label="Organization"
      placeholder="Enter organization name"
      required
    />
  </DialogForm>
);
