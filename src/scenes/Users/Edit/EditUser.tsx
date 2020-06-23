import React from 'react';
import { Except } from 'type-fest';
import { UpdateUserInput } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';
import { UserDetailsFragment } from '../Detail/UserDetail.generated';
import { useUpdateUserMutation } from './EditUser.generated';

export type EditUserProps = Except<
  DialogFormProps<UpdateUserInput>,
  'onSubmit' | 'initialValues'
> & {
  user: UserDetailsFragment;
};

export const EditUser = ({ user, ...props }: EditUserProps) => {
  const [updateUser] = useUpdateUserMutation();

  return (
    <DialogForm<UpdateUserInput>
      DialogProps={{
        fullWidth: true,
        maxWidth: 'xs',
      }}
      title="Edit User"
      {...props}
      onlyDirtySubmit
      initialValues={{ user: { id: user.id } }}
      onSubmit={(input) => {
        updateUser({
          variables: { input },
        });
      }}
    >
      <SubmitError />
      <TextField
        name="user.realFirstName"
        label="First Name"
        placeholder="New First Name"
        disabled={!user.realFirstName.canEdit}
        autoFocus
      />
      <TextField
        name="user.realLastName"
        label="Last Name"
        placeholder="New Last Name"
        disabled={!user.realLastName.canEdit}
      />
      <TextField
        name="user.phone"
        label="Phone"
        placeholder="New Phone Number"
        disabled={!user.phone.canEdit}
      />
      <TextField
        name="user.bio"
        label="Bio"
        placeholder="User Bio"
        disabled={!user.bio.canEdit}
        multiline
      />
    </DialogForm>
  );
};
