import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdateFieldZoneInput } from '~/api/schema.graphql';
import { UserLookupItemFragment } from '~/components/form/Lookup/User/UserLookup.graphql';
import { ButtonLink } from '~/components/Routing';
import {
  FieldZoneForm,
  FieldZoneFormProps,
} from '../FieldZoneForm/FieldZoneForm';
import {
  UpdateFieldZoneDocument,
  UpdateFieldZoneMutation,
} from './EditFieldZone.graphql';

type SubmitResult = UpdateFieldZoneMutation['updateFieldZone']['fieldZone'];

interface EditFieldZoneFormValues {
  fieldZone: {
    id: string;
    name?: string;
    director?: Pick<UserLookupItemFragment, 'id' | 'fullName'>;
  };
}

export type EditFieldZoneProps = Except<
  FieldZoneFormProps<EditFieldZoneFormValues, SubmitResult>,
  'prefix' | 'onSubmit' | 'initialValues'
>;
export const EditFieldZone = (props: EditFieldZoneProps) => {
  const [updateFieldZone] = useMutation(UpdateFieldZoneDocument);
  const { fieldZone } = props;

  const initialValues = useMemo(
    () =>
      fieldZone
        ? {
            fieldZone: {
              id: fieldZone.id,
              name: fieldZone.name.value ?? undefined,
              director: fieldZone.director.value ?? undefined,
            },
          }
        : undefined,
    [fieldZone]
  );

  return (
    <FieldZoneForm<EditFieldZoneFormValues, SubmitResult>
      title="Edit Field Zone"
      initialValues={initialValues}
      {...props}
      prefix="fieldZone"
      onSubmit={async ({ fieldZone: values }) => {
        const input: UpdateFieldZoneInput = {
          fieldZone: {
            id: values.id,
            name: values.name ?? undefined,
            directorId: values.director?.id ?? undefined,
          },
        };

        const { data } = await updateFieldZone({
          variables: { input },
        });
        return data!.updateFieldZone.fieldZone;
      }}
      onSuccess={(fieldZone) => (
        <ButtonLink color="inherit" to={`/field-zones/${fieldZone.id}`}>
          View
        </ButtonLink>
      )}
    />
  );
};
