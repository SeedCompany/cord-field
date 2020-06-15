import React from 'react';
import { CreateLanguageInput } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';

export type CreateLanguageFormProps = DialogFormProps<CreateLanguageInput>;

export const CreateLanguageForm = (props: CreateLanguageFormProps) => (
  <DialogForm
    DialogProps={{
      fullWidth: true,
      maxWidth: 'xs',
    }}
    {...props}
    title="Create Language"
  >
    <SubmitError />
    <TextField
      name="language.name"
      label="Name"
      placeholder="Enter language"
      autoFocus
      required
    />
    <TextField
      name="language.displayName"
      label="Display Name"
      placeholder="Enter Display Name"
      required
    />
    {/* TODO: remove the spinners on the number fields, with theme overrides or a custom number field component */}
    <TextField
      name="language.beginFiscalYear"
      label="Fiscal Year"
      placeholder="Enter Fiscal Year Begun"
      type="number"
    />
    <TextField
      name="language.ethnologueName"
      label="Ethnologue Name"
      placeholder="Enter Ethnologue Name"
    />
    <TextField
      name="language.ethnologuePopulation"
      label="Ethnologue Population"
      placeholder="Enter Ethnologue Population"
      type="number"
    />
    <TextField
      name="language.organizationPopulation"
      label="Organization Population"
      placeholder="Enter Organization Population"
      type="number"
    />
    <TextField
      name="language.rodNumber"
      label="Rod Population"
      placeholder="Enter Rod Population"
      type="number"
    />
  </DialogForm>
);
