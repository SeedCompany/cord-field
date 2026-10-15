import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../components/form';
import {
  DraftOrganization,
  OrganizationField,
  OrganizationLookupItem,
} from '../../../components/form/Lookup/Organization';

export interface PartnerFormValues {
  orgLookup: OrganizationLookupItem;
}

export type CreatePartnerFormProps<R> = DialogFormProps<PartnerFormValues, R>;

export const CreatePartnerForm = <R extends any>(
  props: CreatePartnerFormProps<R>
) => (
  <DialogForm {...props} title="Create Partner">
    <SubmitError />
    <OrganizationField
      name="orgLookup"
      label="Organization"
      placeholder="Enter organization name"
      CreateDialogForm={DraftOrganization}
      required
    />
  </DialogForm>
);
