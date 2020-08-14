import { Grid, makeStyles } from '@material-ui/core';
import { Mutator } from 'final-form';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Except } from 'type-fest';
import { MutationChangePasswordArgs } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  PasswordField,
  SubmitError,
  TextField,
} from '../../../components/form';
import { required } from '../../../components/form/validators';
import { useChangePasswordMutation } from './ChangePassword.generated';

type ChangePasswordProps = Except<
  DialogFormProps<ChangePasswordFields>,
  'onSubmit'
>;

interface ChangePasswordFields extends MutationChangePasswordArgs {
  confirmPassword: string;
}

const useStyles = makeStyles(() => ({
  content: {
    overflow: 'hidden', // prevent scroll bars from negative margins of Grid
  },
}));

export const ChangePassword = (props: ChangePasswordProps) => {
  const [changePassword] = useChangePasswordMutation();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  return (
    <DialogForm<ChangePasswordFields>
      title="Change Password"
      {...props}
      validate={passwordMatching}
      mutators={{ markConfirmPasswordTouched }}
      DialogProps={{
        fullWidth: true,
        maxWidth: 'xs',
      }}
      onlyDirtySubmit
      onSubmit={async (input) => {
        await changePassword({
          variables: input,
        });
        enqueueSnackbar('Changed Password Successfully', {
          variant: 'success',
        });
      }}
    >
      <Grid container spacing={3} className={classes.content}>
        <Grid item xs={12}>
          <SubmitError align="left" />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="oldPassword"
            label="Old Password"
            placeholder="Old Password"
            required
            validate={[required]}
            margin="none"
          />
        </Grid>
        <Grid item xs={12}>
          <PasswordField
            name="newPassword"
            placeholder="Enter New Password"
            label="New Password"
            autoComplete="new-password"
            margin="none"
          />
        </Grid>
        <Grid item xs={12}>
          <PasswordField
            name="confirmPassword"
            label="Re-Type New Password"
            placeholder="Re-Type Your New Password"
            autoComplete="new-password"
            margin="none"
          />
        </Grid>
      </Grid>
    </DialogForm>
  );
};

export const passwordMatching = ({
  newPassword,
  confirmPassword,
  ..._otherVals
}: ChangePasswordFields) => {
  return newPassword && confirmPassword && newPassword !== confirmPassword
    ? {
        newPassword: 'Passwords must match',
        confirmPassword: 'Passwords must match',
      }
    : undefined;
};

export const markConfirmPasswordTouched: Mutator<ChangePasswordFields> = (
  args,
  state
) => {
  state.fields.confirmPassword.touched = true;
};
