import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdateUser } from '~/api/schema.graphql';
import { useUploadFileAsync } from '../../../components/files/hooks';
import { UserForm, UserFormProps, UserFormValues } from '../UserForm';
import { UpdateUserDocument } from './EditUser.graphql';

type FormValues = UserFormValues<UpdateUser>;
type FormProps = UserFormProps<FormValues>;

export type EditUserProps = Except<
  FormProps,
  'fieldsPrefix' | 'onSubmit' | 'initialValues'
>;

export const EditUser = (props: EditUserProps) => {
  const uploadFile = useUploadFileAsync();
  const [updateUser] = useMutation(UpdateUserDocument);
  const user = props.user;

  const initialValues = useMemo(
    () =>
      user
        ? {
            user: {
              id: user.id,
              realFirstName: user.realFirstName.value,
              realLastName: user.realLastName.value,
              displayFirstName: user.displayFirstName.value,
              displayLastName: user.displayLastName.value,
              phone: user.phone.value,
              timezone: user.timezone.value?.name,
              about: user.about.value,
              email: user.email.value,
              title: user.title.value,
              roles: user.roles.value,
              status: user.status.value,
              gender: user.gender.value,
            },
          }
        : undefined,
    [user]
  );

  return (
    <UserForm<FormValues>
      title="Edit Person"
      {...props}
      fieldsPrefix="user"
      initialValues={initialValues}
      onSubmit={async ({ user }) => {
        if (!user) throw new Error('User data is required');

        // Extract photo separately due to type constraints
        const { photo, ...userData } = user as typeof user & { photo?: File[] };
        const [uploadedPhotoInfo, finalizeUpload] = await uploadFile(
          photo?.[0]
        );

        await updateUser({
          variables: {
            input: {
              user: {
                ...userData,
                photo: uploadedPhotoInfo,
              },
            },
          },
        }).then(...finalizeUpload.tap);
      }}
    />
  );
};
