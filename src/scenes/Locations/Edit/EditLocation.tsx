import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdateLocation } from '~/api/schema.graphql';
import {
  LocationForm,
  LocationFormProps,
  LocationFormValues,
} from '../LocationForm';
import { UpdateLocationDocument } from './EditLocation.graphql';

export type EditLocationProps = Except<
  LocationFormProps<LocationFormValues<UpdateLocation>>,
  'onSubmit' | 'initialValues'
>;

export const EditLocation = (props: EditLocationProps) => {
  const [updateLocation] = useMutation(UpdateLocationDocument);
  const location = props.location;

  const initialValues = useMemo(
    () =>
      location
        ? {
            location: {
              id: location.id,
              name: location.name.value,
              type: location.type.value,
              isoAlpha3: location.isoCountry,
              fundingAccountId: location.fundingAccount.value,
            },
          }
        : undefined,
    [location]
  );

  return (
    <LocationForm
      title="Edit Location"
      {...props}
      initialValues={initialValues}
      onSubmit={async ({
        location: { isoAlpha3, fundingAccountId, ...rest },
      }) => {
        await updateLocation({
          variables: {
            input: {
              location: {
                ...rest,
                isoAlpha3: isoAlpha3?.alpha3 ?? null,
                fundingAccountId: fundingAccountId?.id ?? null,
              },
            },
          },
        });
      }}
    />
  );
};
