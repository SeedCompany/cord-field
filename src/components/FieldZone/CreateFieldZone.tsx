import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { CreateFieldZoneInput } from '~/api/schema.graphql';
import { DisplayFieldZoneFragment as FieldZone } from '~/common';
import { DialogForm, DialogFormProps } from '../Dialog/DialogForm';
import { SubmitError, TextField } from '../form';
import { UserField } from '../form/Lookup/User/UserField';
import { UserLookupItemFragment } from '../form/Lookup/User/UserLookup.graphql';
import { CreateFieldZoneDocument } from './CreateFieldZone.graphql';

export interface FieldZoneFormValues {
  fieldZone: {
    name: string;
    director: UserLookupItemFragment;
  };
}

export type CreateFieldZoneProps = Except<
  DialogFormProps<FieldZoneFormValues, FieldZone>,
  'onSubmit'
>;
export const CreateFieldZone = (props: CreateFieldZoneProps) => {
  const [createFieldZone] = useMutation(CreateFieldZoneDocument);
  return (
    <DialogForm
      {...props}
      onSubmit={async ({ fieldZone: values }) => {
        const input: CreateFieldZoneInput = {
          fieldZone: {
            name: values.name,
            directorId: values.director.id,
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
      fieldsPrefix="fieldZone"
    >
      <SubmitError />
      <TextField
        name="name"
        label="Field Zone Name"
        placeholder="Enter field zone name"
        required
      />
      <UserField label="Director" name="director" required />
    </DialogForm>
  );
};
