import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { CreateFieldRegionInput } from '~/api/schema.graphql';
import {
  DisplayFieldZoneFragment,
  DisplayFieldRegionFragment as FieldRegion,
} from '~/common';
import { DialogForm, DialogFormProps } from '../Dialog/DialogForm';
import { SubmitError, TextField } from '../form';
import { FieldZoneField } from '../form/Lookup/FieldZone';
import { UserField } from '../form/Lookup/User/UserField';
import { UserLookupItemFragment } from '../form/Lookup/User/UserLookup.graphql';
import { CreateFieldRegionDocument } from './CreateFieldRegion.graphql';

export interface FieldRegionFormValues {
  fieldRegion: {
    name: string;
    fieldZone: DisplayFieldZoneFragment;
    director: UserLookupItemFragment;
  };
}

export type CreateFieldRegionProps = Except<
  DialogFormProps<FieldRegionFormValues, FieldRegion>,
  'onSubmit'
>;
export const CreateFieldRegion = (props: CreateFieldRegionProps) => {
  const [createFieldRegion] = useMutation(CreateFieldRegionDocument);
  return (
    <DialogForm
      {...props}
      onSubmit={async ({ fieldRegion: values }) => {
        const input: CreateFieldRegionInput = {
          fieldRegion: {
            name: values.name,
            fieldZoneId: values.fieldZone.id,
            directorId: values.director.id,
          },
        };
        const { data } = await createFieldRegion({
          variables: {
            input,
          },
        });

        return data!.createFieldRegion.fieldRegion;
      }}
      title="Create Field Region"
      fieldsPrefix="fieldRegion"
    >
      <SubmitError />
      <TextField
        name="name"
        label="Field Region Name"
        placeholder="Enter field region name"
        required
      />
      <FieldZoneField name="fieldZone" required />
      <UserField label="Director" name="director" required />
    </DialogForm>
  );
};
