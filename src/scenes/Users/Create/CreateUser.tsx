import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { CreatePerson } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { EmailField, SubmitError, TextField } from '../../../components/form';
import { ButtonLink } from '../../../components/Routing';
import { useCreatePersonMutation } from './CreateUser.generated';

type CreatePersonValues = Except<
  CreatePerson,
  'displayFirstName' | 'displayLastName' | 'realFirstName' | 'realLastName'
> & { firstName: string; lastName: string };

type CreateUserProps = Except<DialogFormProps<CreatePersonValues>, 'onSubmit'>;

export const CreateUser: React.FC<CreateUserProps> = (props) => {
  const [createPerson] = useCreatePersonMutation();
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(values: CreatePersonValues) {
    const { email, phone, timezone, bio } = values;
    const input = {
      person: {
        displayFirstName: values.firstName,
        displayLastName: values.lastName,
        realFirstName: values.firstName,
        realLastName: values.lastName,
        email,
        phone,
        timezone,
        bio,
      },
    };
    const { data } = await createPerson({
      variables: { input },
    });
    const user = data!.createPerson.user;
    const {
      realFirstName: { value: firstName },
      realLastName: { value: lastName },
    } = user;

    enqueueSnackbar(`Created user: ${firstName} ${lastName}`, {
      variant: 'success',
      action: () => (
        <ButtonLink color="inherit" to={`/users/${user.id}`}>
          View
        </ButtonLink>
      ),
    });
  }

  return (
    <DialogForm
      DialogProps={{
        fullWidth: true,
        maxWidth: 'xs',
      }}
      {...props}
      onSubmit={handleSubmit}
      title="Create Person"
    >
      <SubmitError />
      <TextField
        name="firstName"
        label="First Name"
        placeholder="Enter First Name"
        required
        autoFocus
      />
      <TextField
        name="lastName"
        label="Last Name"
        placeholder="Enter Last Name"
        required
      />
      <EmailField required={false} />
      <TextField
        name="phone"
        label="Phone"
        placeholder="Enter Phone Number"
        type="tel"
      />
      <TextField
        name="timezone"
        label="Timezone"
        placeholder="Enter Timezone"
      />
      <TextField
        name="bio"
        label="Bio"
        multiline
        placeholder="Enter Bio"
        rows={2}
      />
    </DialogForm>
  );
};
