import { Merge } from 'type-fest';
import { CreateFieldRegion, UpdateFieldRegion } from '~/api/schema.graphql';
import { DisplayFieldZoneFragment } from '~/common';
import { DialogForm, DialogFormProps } from '../../Dialog/DialogForm';
import { SecuredField, SubmitError, TextField } from '../../form';
import { FieldZoneField } from '../../form/Lookup/FieldZone';
import { UserField } from '../../form/Lookup/User/UserField';
import { UserLookupItemFragment } from '../../form/Lookup/User/UserLookup.graphql';
import { FieldRegionFormFragment } from './FieldRegionForm.graphql';

type FieldRegionMutation = UpdateFieldRegion | CreateFieldRegion;

export interface FieldRegionFormValues<Mutation extends FieldRegionMutation> {
  fieldRegion: Merge<
    Mutation,
    {
      fieldZone: DisplayFieldZoneFragment | null;
      director: UserLookupItemFragment | null;
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
  <DialogForm {...rest} fieldsPrefix="fieldRegion">
    <SubmitError />
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
    <SecuredField obj={fieldRegion} name="fieldZone">
      {(props) => <FieldZoneField {...props} label="Field Zone" required />}
    </SecuredField>
    <SecuredField obj={fieldRegion} name="director">
      {(props) => <UserField {...props} label="Director" required />}
    </SecuredField>
  </DialogForm>
);
