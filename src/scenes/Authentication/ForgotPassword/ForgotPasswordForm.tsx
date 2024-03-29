import { Typography } from '@mui/material';
import { Form, FormProps } from 'react-final-form';
import { makeStyles } from 'tss-react/mui';
import {
  EmailField,
  SubmitButton,
  SubmitError,
} from '../../../components/form';
import { Link } from '../../../components/Routing';
import { AuthContent } from '../AuthContent';

const useStyles = makeStyles()(({ spacing }) => ({
  title: {
    marginBottom: spacing(3),
  },
  formError: {
    margin: spacing(2, 0),
  },
  submit: {
    marginTop: spacing(1),
  },
  loginLink: {
    display: 'inline-block',
    marginTop: spacing(1),
  },
}));

export type ForgotPasswordFormProps = Pick<
  FormProps<{ email: string }>,
  'onSubmit' | 'initialValues'
>;

export const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
  const { classes } = useStyles();
  return (
    <AuthContent>
      <Typography variant="h3" align="center" className={classes.title}>
        Reset Your Password
      </Typography>
      <Typography align="center">
        Enter your email address to your account
        <br /> to reset your password.
      </Typography>
      <Form {...props}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <SubmitError className={classes.formError} />
            <EmailField autoFocus autoComplete="email" />
            <SubmitButton className={classes.submit}>
              Reset Password
            </SubmitButton>
          </form>
        )}
      </Form>
      <Link to="/login" className={classes.loginLink}>
        Login
      </Link>
    </AuthContent>
  );
};
