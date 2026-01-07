import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import {
  CreateFieldZoneInput,
  type CreateFieldZone as CreateFieldZoneType,
} from '~/api/schema.graphql';
import { DisplayFieldZoneFragment } from '~/common';
import {
  FieldZoneForm,
  FieldZoneFormProps,
} from '../FieldZoneForm/FieldZoneForm';
import { CreateFieldZoneDocument } from './CreateFieldZone.graphql';

type SubmitResult = DisplayFieldZoneFragment;

export type CreateFieldZoneProps = Except<
  FieldZoneFormProps<CreateFieldZoneType, SubmitResult>,
  'onSubmit'
>;

export const CreateFieldZone = (props: CreateFieldZoneProps) => {
  const [createFieldZone] = useMutation(CreateFieldZoneDocument);

  return (
    <FieldZoneForm<CreateFieldZoneType, SubmitResult>
      {...props}
      title="Create Field Zone"
      onSubmit={async (values) => {
        const input: CreateFieldZoneInput = {
          fieldZone: {
            name: values.fieldZone.name,
            director: values.fieldZone.director!.id,
          },
        };

        const { data } = await createFieldZone({
          variables: { input },
        });
        return data!.createFieldZone.fieldZone;
      }}
    />
  );
};
