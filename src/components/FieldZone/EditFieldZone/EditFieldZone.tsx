import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { Except, SetRequired } from 'type-fest';
import { UpdateFieldZone, UpdateFieldZoneInput } from '~/api/schema.graphql';
import { DisplayFieldZoneFragment } from '~/common';
import {
  FieldZoneForm,
  FieldZoneFormProps,
} from '../FieldZoneForm/FieldZoneForm';
import { UpdateFieldZoneDocument } from './EditFieldZone.graphql';

type SubmitResult = DisplayFieldZoneFragment;
export type EditFieldZoneProps = Except<
  FieldZoneFormProps<UpdateFieldZone, SubmitResult>,
  'onSubmit' | 'initialValues'
>;
export const EditFieldZone = (
  props: SetRequired<EditFieldZoneProps, 'fieldZone'>
) => {
  const [updateFieldZone] = useMutation(UpdateFieldZoneDocument);
  const { fieldZone } = props;

  const initialValues = useMemo(
    () => ({
      fieldZone: {
        id: fieldZone.id,
        name: fieldZone.name.value,
        directorId: fieldZone.director.value ?? null,
      },
    }),
    [fieldZone]
  );

  return (
    <FieldZoneForm<UpdateFieldZone, SubmitResult>
      {...props}
      title="Edit Field Zone"
      initialValues={initialValues}
      onSubmit={async ({ fieldZone: values }) => {
        const input: UpdateFieldZoneInput = {
          fieldZone: {
            id: values.id,
            name: values.name,
            directorId: values.directorId?.id,
          },
        };

        const { data } = await updateFieldZone({
          variables: { input },
        });
        return data!.updateFieldZone.fieldZone;
      }}
    />
  );
};
