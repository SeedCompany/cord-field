import { Grid, makeStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Except } from 'type-fest';
import { MutationChangePasswordArgs } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';
import { minLength, required } from '../../../components/form/validators';
import { useChangePasswordMutation } from './ChangePassword.generated';

type ChangePasswordProps = Except<
  DialogFormProps<MutationChangePasswordArgs>,
  'onSubmit'
>;

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
    <DialogForm<MutationChangePasswordArgs>
      title="Change Password"
      {...props}
      DialogProps={{
        fullWidth: true,
        maxWidth: 'lg',
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
        <Grid item xs={12} sm={6}>
          <TextField
            name="oldPassword"
            label="Old Password"
            placeholder="old password"
            required
            validate={[required, minLength()]}
            margin="none"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="newPassword"
            label="New Password"
            placeholder="new password"
            required
            validate={[required, minLength()]}
            margin="none"
          />
        </Grid>
      </Grid>
    </DialogForm>
  );
};
