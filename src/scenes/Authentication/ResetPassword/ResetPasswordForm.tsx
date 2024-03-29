import { Typography } from '@mui/material';
import { Decorator, Mutator } from 'final-form';
import { Form, FormProps } from 'react-final-form';
import { makeStyles } from 'tss-react/mui';
import {
  blurOnSubmit,
  focusFirstFieldWithSubmitError,
  PasswordField,
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

interface Fields {
  password: string;
  confirm: string;
}

export type ResetPasswordFormProps = Pick<
  FormProps<Fields>,
  'onSubmit' | 'initialValues'
>;

export const ResetPasswordForm = (props: ResetPasswordFormProps) => {
  const { classes } = useStyles();

  return (
    <AuthContent>
      <Typography variant="h3" align="center" className={classes.title}>
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
            <SubmitError className={classes.formError} />
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
            <SubmitButton className={classes.submit}>
              Save Password
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
