import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { addItemToList, CreatePersonInput } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import { UserListItemFragmentDoc } from '../../../components/UserListItemCard/UserListItem.generated';
import { UserForm, UserFormProps } from '../UserForm';
import {
  CreatePersonDocument,
  CreatePersonMutation,
} from './CreateUser.generated';

export type CreateUserProps = Except<
  UserFormProps<
    CreatePersonInput,
    CreatePersonMutation['createPerson']['user']
  >,
  'prefix' | 'onSubmit'
>;

export const CreateUser = (props: CreateUserProps) => {
  const [createPerson] = useMutation(CreatePersonDocument, {
    update: addItemToList({
      listId: 'users',
      itemFragment: UserListItemFragmentDoc,
      outputToItem: (data) => data.createPerson.user,
    }),
  });
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
        });
        return data!.createPerson.user;
      }}
    />
  );
};
