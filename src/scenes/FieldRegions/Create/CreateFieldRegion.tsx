import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import {
  CreateFieldRegionInput,
  type CreateFieldRegion as CreateFieldRegionType,
} from '~/api/schema.graphql';
import { DisplayFieldRegionFragment } from '~/common';
import {
  FieldRegionForm,
  FieldRegionFormProps,
} from '../FieldRegionForm/FieldRegionForm';
import { CreateFieldRegionDocument } from './CreateFieldRegion.graphql';

type SubmitResult = DisplayFieldRegionFragment;

export type CreateFieldRegionProps = Except<
  FieldRegionFormProps<CreateFieldRegionType, SubmitResult>,
  'onSubmit'
>;

export const CreateFieldRegion = (props: CreateFieldRegionProps) => {
  const [createFieldRegion] = useMutation(CreateFieldRegionDocument);

  return (
    <FieldRegionForm<CreateFieldRegionType, SubmitResult>
      {...props}
      title="Create Field Region"
      onSubmit={async (values) => {
        const input: CreateFieldRegionInput = {
          fieldRegion: {
            name: values.fieldRegion.name,
            fieldZoneId: values.fieldRegion.fieldZone!.id,
            directorId: values.fieldRegion.director!.id,
          },
        };

        const { data } = await createFieldRegion({
          variables: { input },
        });
        return data!.createFieldRegion.fieldRegion;
      }}
    />
  );
};
