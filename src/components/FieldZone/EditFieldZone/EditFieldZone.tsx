import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { Except, SetRequired } from 'type-fest';
import { UpdateFieldZone } from '~/api/schema.graphql';
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
      id: fieldZone.id,
      name: fieldZone.name.value,
      director: fieldZone.director.value ?? null,
    }),
    [fieldZone]
  );

  return (
    <FieldZoneForm<UpdateFieldZone, SubmitResult>
      {...props}
      title="Edit Field Zone"
      initialValues={initialValues}
      onSubmit={async (values) => {
        const input: UpdateFieldZone = {
          id: values.id,
          name: values.name,
          director: values.director?.id,
        };

        const { data } = await updateFieldZone({
          variables: { input },
        });
        return data!.updateFieldZone.fieldZone;
      }}
    />
  );
};
