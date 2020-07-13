import React from 'react';
import { Except } from 'type-fest';
import { UpdateUserInput } from '../../../api';
import { UserForm, UserFormProps } from '../UserForm';
import { useUpdateUserMutation } from './EditUser.generated';

export type EditUserProps = Except<
  UserFormProps<UpdateUserInput>,
  'prefix' | 'onSubmit' | 'initialValues'
>;

export const EditUser = (props: EditUserProps) => {
  const [updateUser] = useUpdateUserMutation();
  const user = props.user;

  return (
    <UserForm<UpdateUserInput>
      title="Edit Person"
      {...props}
      prefix="user"
      initialValues={
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
                bio: user.bio.value,
              },
            }
          : undefined
      }
      onSubmit={async (input) => {
        await updateUser({
          variables: { input },
        });
      }}
    />
  );
};
