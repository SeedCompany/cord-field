import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { CreateFieldRegionInput, FieldZone, User } from '~/api/schema.graphql';
import { DisplayFieldRegionFragment as FieldRegion } from '~/common';
import { DialogForm, DialogFormProps } from '../Dialog/DialogForm';
import { SubmitError, TextField } from '../form';
import { FieldZoneField } from '../form/Lookup/FieldZone';
import { UserField } from '../form/Lookup/User/UserField';
import { CreateFieldRegionDocument } from './CreateFieldRegion.graphql';

/*
  CreateFieldRegionInput doesn't properly reflect the input from the fields, therefore the need for FieldRegionInput
*/
export interface FieldRegionInput {
  fieldRegion: { name: string };
  fieldZone: Partial<FieldZone>;
  director: Partial<User>;
}

export type CreateFieldRegionProps = Except<
  DialogFormProps<FieldRegionInput, FieldRegion>,
  'onSubmit'
>;
export const CreateFieldRegion = (props: CreateFieldRegionProps) => {
  const [createFieldRegion] = useMutation(CreateFieldRegionDocument);
  return (
    <DialogForm
      {...props}
      onSubmit={async ({ fieldRegion, fieldZone, director }) => {
        const input: CreateFieldRegionInput = {
          fieldRegion: {
            name: fieldRegion.name,
            fieldZoneId: fieldZone.id!,
            directorId: director.id!,
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
    >
      <SubmitError />
      <TextField
        name="fieldRegion.name"
        label="Field Region Name"
        placeholder="Enter field region name"
        required
      />
      <FieldZoneField name="fieldZone" required />
      <UserField label="Director" name="director" required />
    </DialogForm>
  );
};
