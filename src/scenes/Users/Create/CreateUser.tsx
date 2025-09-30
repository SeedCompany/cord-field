import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { CreatePerson, CreatePersonInput } from '~/api/schema.graphql';
import { useUploadFileAsync } from '../../../components/files/hooks';
import { ButtonLink } from '../../../components/Routing';
import { UserForm, UserFormProps, UserFormValues } from '../UserForm';
import {
  CreatePersonDocument,
  CreatePersonMutation,
} from './CreateUser.graphql';

type FormValues = UserFormValues<CreatePerson>;
type SubmitResult = CreatePersonMutation['createPerson']['user'];
export type CreateUserProps = Except<
  UserFormProps<FormValues, SubmitResult>,
  'fieldsPrefix' | 'onSubmit'
>;

export const CreateUser = (props: CreateUserProps) => {
  const uploadFile = useUploadFileAsync();
  const [createPerson] = useMutation(CreatePersonDocument, {
    update: addItemToList({
      listId: 'users',
      outputToItem: (data) => data.createPerson.user,
    }),
  });
  const { enqueueSnackbar } = useSnackbar();

  return (
    <UserForm<FormValues, SubmitResult>
      title="Create Person"
      onSuccess={(user) => {
        enqueueSnackbar(`Created person: ${user.fullName}`, {
          variant: 'success',
          action: () => (
            <ButtonLink color="inherit" to={`/users/${user.id}`}>
              View
            </ButtonLink>
          ),
        });
      }}
      {...props}
      fieldsPrefix="person"
      onSubmit={async ({ person }) => {
        // Extract photo separately due to type constraints
        const { photo, ...personData } = person;
        const [uploadedPhotoInfo, finalizeUpload] = await uploadFile(
          photo?.[0]
        );

        const input: CreatePersonInput = {
          person: {
            ...personData,
            photo: uploadedPhotoInfo,
          },
        };

        const { data } = await createPerson({
          variables: { input },
        }).then(...finalizeUpload.tap);
        return data!.createPerson.user;
      }}
    />
  );
};
