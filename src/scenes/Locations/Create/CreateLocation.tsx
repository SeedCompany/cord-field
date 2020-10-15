import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { CreateLocationInput } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import { LocationForm, LocationFormProps } from '../LocationForm';
import {
  CreateLocationDocument,
  CreateLocationMutation,
} from './CreateLocation.generated';

export type CreateLocationProps = Except<
  LocationFormProps<
    CreateLocationInput,
    CreateLocationMutation['createLocation']['location']
  >,
  'prefix' | 'onSubmit'
>;

export const CreateLocation = (props: CreateLocationProps) => {
  const [createLocation] = useMutation(CreateLocationDocument);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <LocationForm
      title="Create Location"
      onSuccess={(location) => {
        enqueueSnackbar(`Created location: ${location.name}`, {
          variant: 'success',
          action: () => (
            <ButtonLink color="inherit" to={`/locations/${location.id}`}>
              View
            </ButtonLink>
          ),
        });
      }}
      {...props}
      prefix="person"
      onSubmit={async (input) => {
        const { data } = await createLocation({
          variables: { input },
        });
        return data!.createLocation.location;
      }}
    />
  );
};
