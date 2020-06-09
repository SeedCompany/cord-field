import React from 'react';
import { CreateProjectInput } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  RadioField,
  RadioOption,
  SubmitError,
  TextField,
} from '../../../components/form';

export type CreateProjectFormProps = DialogFormProps<CreateProjectInput>;

export const CreateProjectForm = (props: CreateProjectFormProps) => (
  <DialogForm
    DialogProps={{
      fullWidth: true,
      maxWidth: 'xs',
    }}
    {...props}
    title="Create Project"
  >
    <SubmitError />
    <TextField
      name="project.name"
      label="Name"
      placeholder="Enter project name"
      autoFocus
    />
    <RadioField name="project.type" label="Type">
      <RadioOption label="Translation" value="Translation" />
      <RadioOption label="Internship" value="Internship" />
    </RadioField>
  </DialogForm>
);
