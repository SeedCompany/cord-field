import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { CreatePersonInput } from '~/api/schema.graphql';
import { ButtonLink } from '../../../components/Routing';
import { UserForm, UserFormProps } from '../UserForm';
import {
  CreatePersonDocument,
  CreatePersonMutation,
} from './CreateUser.graphql';

type SubmitResult = CreatePersonMutation['createPerson']['user'];
export type CreateUserProps = Except<
  UserFormProps<CreatePersonInput, SubmitResult>,
  'fieldsPrefix' | 'onSubmit'
>;

export const CreateUser = (props: CreateUserProps) => {
  const [createPerson] = useMutation(CreatePersonDocument, {
    update: addItemToList({
      listId: 'users',
      outputToItem: (data) => data.createPerson.user,
    }),
  });
  const { enqueueSnackbar } = useSnackbar();

  return (
    <UserForm<CreatePersonInput, SubmitResult>
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
      onSubmit={async (input) => {
        const { data } = await createPerson({
          variables: { input },
        });
        return data!.createPerson.user;
      }}
    />
  );
};
