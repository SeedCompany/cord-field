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
} from './CreateLocation.generated';

export type CreateLocationProps = Except<
  LocationFormProps<
    LocationFormValues<CreateLocationType>,
    CreateLocationMutation['createLocation']['location']
  >,
  'onSubmit'
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
      onSubmit={async ({ location: { fundingAccountLookupItem, ...rest } }) => {
        const { data } = await createLocation({
          variables: {
            input: {
              location: {
                ...rest,
                fundingAccountId: fundingAccountLookupItem?.id,
              },
            },
          },
        });
        return data!.createLocation.location;
      }}
    />
  );
};
