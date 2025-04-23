import { useMutation } from '@apollo/client';
import { Mutator } from 'final-form';
import { useSnackbar } from 'notistack';
import { Except } from 'type-fest';
import { MutationChangePasswordArgs } from '~/api/schema.graphql';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { PasswordField, SubmitError } from '../../../components/form';
import { ChangePasswordDocument } from './ChangePassword.graphql';

type ChangePasswordProps = Except<
  DialogFormProps<ChangePasswordFields>,
  'onSubmit'
>;

interface ChangePasswordFields extends MutationChangePasswordArgs {
  confirmPassword: string;
}

export const ChangePassword = (props: ChangePasswordProps) => {
  const [changePassword] = useMutation(ChangePasswordDocument);
  const { enqueueSnackbar } = useSnackbar();

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
      onSubmit={async (input) => {
        await changePassword({
          variables: input,
        });
        enqueueSnackbar('Changed Password Successfully', {
          variant: 'success',
        });
      }}
    >
      <SubmitError />
      <PasswordField
        name="oldPassword"
        label="Old Password"
        placeholder="Old Password"
        required
      />
      <PasswordField
        name="newPassword"
        placeholder="Enter New Password"
        label="New Password"
        autoComplete="new-password"
      />
      <PasswordField
        name="confirmPassword"
        label="Re-Type New Password"
        placeholder="Re-Type Your New Password"
        autoComplete="new-password"
      />
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
  state.fields.confirmPassword!.touched = true;
};
