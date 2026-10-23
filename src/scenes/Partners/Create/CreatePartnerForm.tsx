import { CreateOrganization } from '~/api/schema.graphql';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';

export interface PartnerFormValues {
  organization: Pick<CreateOrganization, 'name'>;
}

export type CreatePartnerFormProps<R> = DialogFormProps<PartnerFormValues, R>;

export const CreatePartnerForm = <R extends any>(
  props: CreatePartnerFormProps<R>
) => (
  <DialogForm
    title="Create Partner"
    errorHandlers={{
      // The API reports a taken organization name on `name`
      Duplicate: (e, next) =>
        e.field === 'name'
          ? { organization: { name: 'Already in use' } }
          : next(e),
    }}
    {...props}
  >
    <SubmitError />
    <TextField
      name="organization.name"
      label="Organization Name"
      placeholder="Enter organization name"
      required
    />
  </DialogForm>
);
