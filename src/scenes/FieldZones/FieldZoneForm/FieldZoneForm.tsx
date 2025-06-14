import { Stack } from '@mui/material';
import { Merge } from 'type-fest';
import { CreateFieldZone, UpdateFieldZone } from '~/api/schema.graphql';
import { DialogForm, DialogFormProps } from '~/components/Dialog/DialogForm';
import { SecuredField, SubmitError, TextField } from '~/components/form';
import { FieldGroup } from '~/components/form/FieldGroup';
import { UserField } from '~/components/form/Lookup/User/UserField';
import { UserLookupItemFragment } from '~/components/form/Lookup/User/UserLookup.graphql';
import { FieldZoneFormFragment } from './FieldZoneForm.graphql';

type FieldZoneMutation = UpdateFieldZone | CreateFieldZone;

export interface FieldZoneFormValues<Mutation extends FieldZoneMutation> {
  fieldZone: Merge<
    Mutation,
    {
      director?: Pick<UserLookupItemFragment, 'id' | 'fullName'>;
    }
  >;
}

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
    <FieldGroup prefix="fieldZone">
      <Stack>
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
        <SecuredField obj={fieldZone} name="directorId">
          {(props) => (
            <UserField {...props} name="director" label="Director" required />
          )}
        </SecuredField>
      </Stack>
    </FieldGroup>
  </DialogForm>
);
