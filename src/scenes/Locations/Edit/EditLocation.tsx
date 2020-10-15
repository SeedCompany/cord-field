import { useMutation } from '@apollo/client';
import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdateLocation } from '../../../api';
import {
  LocationForm,
  LocationFormProps,
  LocationFormValues,
} from '../LocationForm';
import { UpdateLocationDocument } from './EditLocation.generated';

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
              sensitivity: location.sensitivity,
              isoAlpha3: location.isoAlpha3.value,
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
      onSubmit={async (input) => {
        await updateLocation({
          variables: {
            input,
          },
        });
      }}
    />
  );
};
