import { useMutation } from '@apollo/client';
import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import { Maybe, UpdateUserInput } from '../../../api';
import { UserForm, UserFormProps } from '../UserForm';
import { UpdateUserDocument } from './EditUser.generated';

export type EditUserProps = Except<
  UserFormProps<UpdateUserInput>,
  'prefix' | 'onSubmit' | 'initialValues'
>;

export const EditUser = (props: EditUserProps) => {
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
            },
          }
        : undefined,
    [user]
  );

  return (
    <UserForm<UpdateUserInput & { user: { email?: Maybe<string> } }>
      title="Edit Person"
      {...props}
      prefix="user"
      initialValues={initialValues}
      onSubmit={async ({ user: { email, ...user } }) => {
        await updateUser({
          variables: {
            input: {
              user,
            },
          },
        });
      }}
    />
  );
};
