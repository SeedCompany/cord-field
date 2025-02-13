import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { CreateFieldZoneInput, User } from '~/api/schema.graphql';
import { DisplayFieldZoneFragment as FieldZone } from '~/common';
import { DialogForm, DialogFormProps } from '../Dialog/DialogForm';
import { SubmitError, TextField } from '../form';
import { UserField } from '../form/Lookup/User/UserField';
import { CreateFieldZoneDocument } from './CreateFieldZone.graphql';

/*
  CreateFieldZoneInput doesn't properly reflect the input from the fields, therefore the need for FieldZoneInput
*/
export interface FieldZoneInput {
  fieldZone: { name: string };
  director: Partial<User>;
}

export type CreateFieldZoneProps = Except<
  DialogFormProps<FieldZoneInput, FieldZone>,
  'onSubmit'
>;
export const CreateFieldZone = (props: CreateFieldZoneProps) => {
  const [createFieldZone] = useMutation(CreateFieldZoneDocument);
  return (
    <DialogForm
      {...props}
      onSubmit={async ({ fieldZone, director }) => {
        const input: CreateFieldZoneInput = {
          fieldZone: {
            name: fieldZone.name,
            directorId: director.id!,
          },
        };
        const { data } = await createFieldZone({
          variables: {
            input,
          },
        });
        return data!.createFieldZone.fieldZone;
      }}
      title="Create Field Zone"
    >
      <SubmitError />
      <TextField
        name="fieldZone.name"
        label="Field Zone Name"
        placeholder="Enter field zone name"
        required
      />
      <UserField label="Director" name="director" required />
    </DialogForm>
  );
};
