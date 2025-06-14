import { Stack } from '@mui/material';
import { Merge } from 'type-fest';
import { CreateFieldRegion, UpdateFieldRegion } from '~/api/schema.graphql';
import { DisplayFieldZoneFragment } from '~/common';
import { DialogForm, DialogFormProps } from '~/components/Dialog/DialogForm';
import { SecuredField, SubmitError, TextField } from '~/components/form';
import { FieldGroup } from '~/components/form/FieldGroup';
import { FieldZoneField } from '~/components/form/Lookup/FieldZone';
import { UserField } from '~/components/form/Lookup/User/UserField';
import { UserLookupItemFragment } from '~/components/form/Lookup/User/UserLookup.graphql';
import { FieldRegionFormFragment } from './FieldRegionForm.graphql';

type FieldRegionMutation = UpdateFieldRegion | CreateFieldRegion;

export interface FieldRegionFormValues<Mutation extends FieldRegionMutation> {
  fieldRegion: Merge<
    Mutation,
    {
      fieldZone?: DisplayFieldZoneFragment;
      director?: Pick<UserLookupItemFragment, 'id' | 'fullName'>;
    }
  >;
}

export type FieldRegionFormProps<
  Mutation extends FieldRegionMutation,
  R
> = DialogFormProps<FieldRegionFormValues<Mutation>, R> & {
  fieldRegion?: FieldRegionFormFragment;
};

export const FieldRegionForm = <Mutation extends FieldRegionMutation, R>({
  fieldRegion,
  ...rest
}: FieldRegionFormProps<Mutation, R>) => (
  <DialogForm {...rest}>
    <SubmitError />
    <FieldGroup prefix="fieldRegion">
      <Stack>
        <SecuredField obj={fieldRegion} name="name">
          {(props) => (
            <TextField
              {...props}
              label="Field Region Name"
              placeholder="Enter Field Region Name"
              required
            />
          )}
        </SecuredField>
        <SecuredField obj={fieldRegion} name="fieldZoneId">
          {(props) => (
            <FieldZoneField
              {...props}
              name="fieldZone"
              label="Field Zone"
              required
            />
          )}
        </SecuredField>
        <SecuredField obj={fieldRegion} name="directorId">
          {(props) => (
            <UserField {...props} name="director" label="Director" required />
          )}
        </SecuredField>
      </Stack>
    </FieldGroup>
  </DialogForm>
);
