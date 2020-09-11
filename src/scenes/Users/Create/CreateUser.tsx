import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { CreatePersonInput, GQLOperations } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import { UserForm, UserFormProps } from '../UserForm';
import {
  CreatePersonMutation,
  useCreatePersonMutation,
} from './CreateUser.generated';

export type CreateUserProps = Except<
  UserFormProps<
    CreatePersonInput,
    CreatePersonMutation['createPerson']['user']
  >,
  'prefix' | 'onSubmit'
>;

export const CreateUser = (props: CreateUserProps) => {
  const [createPerson] = useCreatePersonMutation();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <UserForm
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
      prefix="person"
      onSubmit={async (input) => {
        const { data } = await createPerson({
          variables: { input },
          refetchQueries: [GQLOperations.Query.Users],
        });
        return data!.createPerson.user;
      }}
    />
  );
};
