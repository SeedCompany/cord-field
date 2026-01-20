import { CreateOrganization } from '~/api/schema.graphql';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';

export type CreateOrganizationFormProps<R> = DialogFormProps<
  CreateOrganization,
  R
>;

export const CreateOrganizationForm = <R extends any>(
  props: CreateOrganizationFormProps<R>
) => (
  <DialogForm {...props} title="Create Organization">
    <SubmitError />
    <TextField
      name="name"
      label="Name"
      placeholder="Enter organization name"
      required
    />
  </DialogForm>
);
