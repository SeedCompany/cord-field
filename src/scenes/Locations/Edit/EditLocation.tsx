import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdateLocation } from '~/api/schema.graphql';
import { useUploadFileAsync } from '../../../components/files/hooks';
import {
  LocationForm,
  LocationFormProps,
  LocationFormValues,
} from '../LocationForm';
import { UpdateLocationDocument } from './EditLocation.graphql';

type FormProps = LocationFormProps<LocationFormValues<UpdateLocation>>;

export type EditLocationProps = Except<FormProps, 'onSubmit' | 'initialValues'>;

export const EditLocation = (props: EditLocationProps) => {
  const uploadFile = useUploadFileAsync();
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
              isoAlpha3: location.isoAlpha3.value,
              fundingAccountId: location.fundingAccount.value,
            },
          }
        : undefined,
    [location]
  );

  const onSubmit: FormProps['onSubmit'] = async ({
    location: { isoAlpha3, fundingAccountId, mapImage: mapImages, ...rest },
  }) => {
    const [uploadedImageInfo, finalizeUpload] = await uploadFile(
      mapImages?.[0]
    );

    const input: UpdateLocation = {
      ...rest,
      isoAlpha3: isoAlpha3 ?? null,
      fundingAccountId: fundingAccountId?.id ?? null,
      mapImage: uploadedImageInfo,
    };

    await updateLocation({
      variables: { input: { location: input } },
    }).then(...finalizeUpload.tap);
  };
  return (
    <LocationForm
      title="Edit Location"
      {...props}
      initialValues={initialValues}
      onSubmit={onSubmit}
    />
  );
};
