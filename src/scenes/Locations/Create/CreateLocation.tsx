import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Except } from 'type-fest';
import { CreateLocation as CreateLocationType } from '~/api/schema.graphql';
import { useUploadFileAsync } from '../../../components/files/hooks';
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
type FormProps = LocationFormProps<FormValues, SubmitResult>;

export type CreateLocationProps = Except<FormProps, 'onSubmit'>;

export const CreateLocation = (props: CreateLocationProps) => {
  const uploadFile = useUploadFileAsync();
  const [createLocation] = useMutation(CreateLocationDocument);
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit: FormProps['onSubmit'] = async ({
    location: { fundingAccountId, mapImage: mapImages, ...rest },
  }) => {
    const [uploadedImageInfo, finalizeUpload] = await uploadFile(
      mapImages?.[0]
    );

    const input: CreateLocationType = {
      ...rest,
      fundingAccountId: fundingAccountId?.id,
      mapImage: uploadedImageInfo,
    };
    const { data } = await createLocation({
      variables: { input: { location: input } },
    }).then(...finalizeUpload.tap);
    return data!.createLocation.location;
  };
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
      onSubmit={onSubmit}
    />
  );
};
