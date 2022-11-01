import { Typography } from '@mui/material';
import { Decorator, Mutator } from 'final-form';
import { Form, FormProps } from 'react-final-form';
import {
  blurOnSubmit,
  focusFirstFieldWithSubmitError,
  PasswordField,
  SubmitButton,
  SubmitError,
} from '../../../components/form';
import { Link } from '../../../components/Routing';
import { AuthContent } from '../AuthContent';

interface Fields {
  password: string;
  confirm: string;
}

export type ResetPasswordFormProps = Pick<
  FormProps<Fields>,
  'onSubmit' | 'initialValues'
>;

export const ResetPasswordForm = (props: ResetPasswordFormProps) => {
  return (
    <AuthContent>
      <Typography variant="h3" align="center" sx={{ mb: 3 }}>
        Password Reset
      </Typography>
      <Typography align="center">Choose a password for you account.</Typography>
      <Form<Fields>
        {...props}
        validate={passwordMatching}
        decorators={decorators}
        mutators={{ markConfirmTouched }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <SubmitError sx={{ my: 2 }} />
            <PasswordField
              label="New Password"
              placeholder="Create New Password"
              autoFocus
              autoComplete="new-password"
            />
            <PasswordField
              name="confirm"
              label="Re-Type Password"
              placeholder="Re-Enter New Password"
              autoComplete="new-password"
            />
            <SubmitButton sx={{ mt: 1 }}>Save Password</SubmitButton>
          </form>
        )}
      </Form>
      <Link to="/login" sx={{ display: 'inline-block', mt: 1 }}>
        Login
      </Link>
    </AuthContent>
  );
};

const passwordMatching = ({ password, confirm }: Fields) => {
  return password && confirm && password !== confirm
    ? {
        password: 'Passwords must match',
        confirm: 'Passwords must match',
      }
    : undefined;
};

const showMatchingErrorsImmediately: Decorator<Fields> = (form) =>
  form.subscribe(
    ({ active, values }) => {
      if (active === 'confirm' && values.confirm) {
        form.mutators.markConfirmTouched!();
      }
    },
    { active: true, values: true }
  );

const markConfirmTouched: Mutator<Fields> = (args, state) => {
  state.fields.confirm!.touched = true;
};

const decorators = [
  showMatchingErrorsImmediately,
  blurOnSubmit,
  focusFirstFieldWithSubmitError,
];
