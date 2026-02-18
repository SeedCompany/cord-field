import { Merge } from 'type-fest';
import { CreateFieldZone, UpdateFieldZone } from '~/api/schema.graphql';
import { DialogForm, DialogFormProps } from '../../Dialog/DialogForm';
import { SecuredField, SubmitError, TextField } from '../../form';
import { UserField } from '../../form/Lookup/User/UserField';
import { UserLookupItemFragment } from '../../form/Lookup/User/UserLookup.graphql';
import { FieldZoneFormFragment } from './FieldZoneForm.graphql';

type FieldZoneMutation = UpdateFieldZone | CreateFieldZone;

export type FieldZoneFormValues<Mutation extends FieldZoneMutation> = Merge<
  Mutation,
  {
    director: UserLookupItemFragment | null;
  }
>;

export type FieldZoneFormProps<
  Mutation extends FieldZoneMutation,
  R
> = DialogFormProps<FieldZoneFormValues<Mutation>, R> & {
  fieldZone?: FieldZoneFormFragment;
};

export const FieldZoneForm = <Mutation extends FieldZoneMutation, R>({
  fieldZone,
  ...rest
}: FieldZoneFormProps<Mutation, R>) => (
  <DialogForm {...rest}>
    <SubmitError />
    <SecuredField obj={fieldZone} name="name">
      {(props) => (
        <TextField
          {...props}
          label="Field Zone Name"
          placeholder="Enter Field Zone Name"
          required
        />
      )}
    </SecuredField>
    <SecuredField obj={fieldZone} name="director">
      {(props) => <UserField {...props} label="Director" required />}
    </SecuredField>
  </DialogForm>
);
