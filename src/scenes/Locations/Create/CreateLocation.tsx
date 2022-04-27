import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { CreateLocation as CreateLocationType } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import {
  LocationForm,
  LocationFormProps,
  LocationFormValues,
} from '../LocationForm';
import {
  CreateLocationDocument,
  CreateLocationMutation,
} from './CreateLocation.graphql';

type FormValues = LocationFormValues<CreateLocationType>;
type SubmitResult = CreateLocationMutation['createLocation']['location'];
export type CreateLocationProps = Except<
  LocationFormProps<FormValues, SubmitResult>,
  'onSubmit'
>;

export const CreateLocation = (props: CreateLocationProps) => {
  const [createLocation] = useMutation(CreateLocationDocument);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <LocationForm<FormValues, SubmitResult>
      title="Create Location"
      onSuccess={(location) => {
        enqueueSnackbar(`Created location: ${location.name.value}`, {
          variant: 'success',
          action: () => (
            <ButtonLink color="inherit" to={`/locations/${location.id}`}>
              View
            </ButtonLink>
          ),
        });
      }}
      {...props}
      onSubmit={async ({ location: { fundingAccountId, ...rest } }) => {
        const { data } = await createLocation({
          variables: {
            input: {
              location: {
                ...rest,
                fundingAccountId: fundingAccountId?.id,
              },
            },
          },
        });
        return data!.createLocation.location;
      }}
    />
  );
};
