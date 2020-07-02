import { Grid } from '@material-ui/core';
import { Decorator } from 'final-form';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { CreatePersonInput } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  EmailField,
  FieldGroup,
  matchFieldIfSame,
  SubmitError,
  TextField,
} from '../../../components/form';
import { ButtonLink } from '../../../components/Routing';
import { useCreatePersonMutation } from './CreateUser.generated';

type CreateUserProps = Except<DialogFormProps<CreatePersonInput>, 'onSubmit'>;

const decorators: Array<Decorator<CreatePersonInput>> = [
  matchFieldIfSame('person.realFirstName', 'person.displayFirstName'),
  matchFieldIfSame('person.realLastName', 'person.displayLastName'),
];

export const CreateUser = (props: CreateUserProps) => {
  const [createPerson] = useCreatePersonMutation();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <DialogForm<CreatePersonInput>
      DialogProps={{
        fullWidth: true,
        maxWidth: 'sm',
      }}
      title="Create Person"
      {...props}
      onSubmit={async (input) => {
        const { data } = await createPerson({
          variables: { input },
        });
        const user = data!.createPerson.user;

        enqueueSnackbar(`Created person: ${user.fullName}`, {
          variant: 'success',
          action: () => (
            <ButtonLink color="inherit" to={`/users/${user.id}`}>
              View
            </ButtonLink>
          ),
        });
      }}
      decorators={decorators}
    >
      <SubmitError />
      <FieldGroup prefix="person">
        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              name="realFirstName"
              label="First Name"
              placeholder="Enter First Name"
              required
              autoFocus
            />
          </Grid>
          <Grid item xs>
            <TextField
              name="realLastName"
              label="Last Name"
              placeholder="Enter Last Name"
              required
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              name="displayFirstName"
              label="Public First Name"
              placeholder="Enter Public First Name"
              required
            />
          </Grid>
          <Grid item xs>
            <TextField
              name="displayLastName"
              label="Public Last Name"
              placeholder="Enter Public Last Name"
              required
            />
          </Grid>
        </Grid>
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
          label="Biography"
          multiline
          placeholder="Enter Biography"
          rows={3}
        />
      </FieldGroup>
    </DialogForm>
  );
};
