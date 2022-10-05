import { Typography } from '@mui/material';
import { Form, FormProps } from 'react-final-form';
import {
  EmailField,
  SubmitButton,
  SubmitError,
} from '../../../components/form';
import { Link } from '../../../components/Routing';
import { AuthContent } from '../AuthContent';

export type ForgotPasswordFormProps = Pick<
  FormProps<{ email: string }>,
  'onSubmit' | 'initialValues'
>;

export const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
  return (
    <AuthContent>
      <Typography
        variant="h3"
        align="center"
        sx={(theme) => ({
          marginBottom: theme.spacing(3),
        })}
      >
        Reset Your Password
      </Typography>
      <Typography align="center">
        Enter your email address to your account
        <br /> to reset your password.
      </Typography>
      <Form {...props}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <SubmitError
              sx={(theme) => ({
                margin: theme.spacing(2, 0),
              })}
            />
            <EmailField autoFocus autoComplete="email" />
            <SubmitButton
              sx={(theme) => ({
                marginTop: theme.spacing(1),
              })}
            >
              Reset Password
            </SubmitButton>
          </form>
        )}
      </Form>
      <Link
        to="/login"
        sx={(theme) => ({
          display: 'inline-block',
          marginTop: theme.spacing(1),
        })}
      >
        Login
      </Link>
    </AuthContent>
  );
};
