import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdateFieldRegionInput } from '~/api/schema.graphql';
import { DisplayFieldZoneFragment } from '~/common';
import { UserLookupItemFragment } from '~/components/form/Lookup/User/UserLookup.graphql';
import { ButtonLink } from '~/components/Routing';
import {
  FieldRegionForm,
  FieldRegionFormProps,
} from '../../../scenes/FieldRegions/FieldRegionForm/FieldRegionForm';
import {
  UpdateFieldRegionDocument,
  UpdateFieldRegionMutation,
} from './EditFieldRegion.graphql';

type SubmitResult =
  UpdateFieldRegionMutation['updateFieldRegion']['fieldRegion'];

interface EditFieldRegionFormValues {
  fieldRegion: {
    id: string;
    name?: string;
    fieldZone?: DisplayFieldZoneFragment;
    director?: Pick<UserLookupItemFragment, 'id' | 'fullName'>;
  };
}

export type EditFieldRegionProps = Except<
  FieldRegionFormProps<EditFieldRegionFormValues, SubmitResult>,
  'prefix' | 'onSubmit' | 'initialValues'
>;
export const EditFieldRegion = (props: EditFieldRegionProps) => {
  const [updateFieldRegion] = useMutation(UpdateFieldRegionDocument);
  const { fieldRegion } = props;

  const initialValues = useMemo(
    () =>
      fieldRegion
        ? {
            fieldRegion: {
              id: fieldRegion.id,
              name: fieldRegion.name.value ?? undefined,
              fieldZone: fieldRegion.fieldZone.value ?? undefined,
              director: fieldRegion.director.value ?? undefined,
            },
          }
        : undefined,
    [fieldRegion]
  );

  return (
    <FieldRegionForm<EditFieldRegionFormValues, SubmitResult>
      title="Edit Field Region"
      initialValues={initialValues}
      {...props}
      prefix="fieldRegion"
      onSubmit={async ({ fieldRegion: values }) => {
        const input: UpdateFieldRegionInput = {
          fieldRegion: {
            id: values.id,
            name: values.name ?? undefined,
            fieldZoneId: values.fieldZone?.id ?? undefined,
            directorId: values.director?.id ?? undefined,
          },
        };

        const { data } = await updateFieldRegion({
          variables: { input },
        });
        return data!.updateFieldRegion.fieldRegion;
      }}
      onSuccess={(fieldRegion) => (
        <ButtonLink color="inherit" to={`/field-regions/${fieldRegion.id}`}>
          View
        </ButtonLink>
      )}
    />
  );
};
