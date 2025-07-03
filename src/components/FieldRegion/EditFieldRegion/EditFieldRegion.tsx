import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { Except, SetRequired } from 'type-fest';
import {
  UpdateFieldRegion,
  UpdateFieldRegionInput,
} from '~/api/schema.graphql';
import { DisplayFieldRegionFragment } from '~/common';
import {
  FieldRegionForm,
  FieldRegionFormProps,
} from '../FieldRegionForm/FieldRegionForm';
import { UpdateFieldRegionDocument } from './EditFieldRegion.graphql';

type SubmitResult = DisplayFieldRegionFragment;
export type EditFieldRegionProps = Except<
  FieldRegionFormProps<UpdateFieldRegion, SubmitResult>,
  'onSubmit' | 'initialValues'
>;
export const EditFieldRegion = (
  props: SetRequired<EditFieldRegionProps, 'fieldRegion'>
) => {
  const [updateFieldRegion] = useMutation(UpdateFieldRegionDocument);
  const { fieldRegion } = props;

  const initialValues = useMemo(
    () => ({
      fieldRegion: {
        id: fieldRegion.id,
        name: fieldRegion.name.value,
        fieldZoneId: fieldRegion.fieldZone.value ?? null,
        directorId: fieldRegion.director.value ?? null,
      },
    }),
    [fieldRegion]
  );

  return (
    <FieldRegionForm<UpdateFieldRegion, SubmitResult>
      {...props}
      title="Edit Field Region"
      initialValues={initialValues}
      onSubmit={async ({ fieldRegion: values }) => {
        const input: UpdateFieldRegionInput = {
          fieldRegion: {
            id: values.id,
            name: values.name,
            fieldZoneId: values.fieldZoneId?.id,
            directorId: values.directorId?.id,
          },
        };

        const { data } = await updateFieldRegion({
          variables: { input },
        });

        return data!.updateFieldRegion.fieldRegion;
      }}
    />
  );
};
