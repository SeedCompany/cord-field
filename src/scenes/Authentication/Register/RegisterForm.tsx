import { makeStyles, Typography } from '@material-ui/core';
import { Decorator, Mutator } from 'final-form';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import { RegisterInput } from '../../../api';
import {
  blurOnSubmit,
  EmailField,
  focusFirstFieldWithSubmitError,
  matchFieldIfSame,
  PasswordField,
  SubmitButton,
  SubmitError,
  TextField,
} from '../../../components/form';
import { minLength } from '../../../components/form/validators';
import { CordIcon } from '../../../components/Icons';
import { Link } from '../../../components/Routing';

const useStyles = makeStyles(({ spacing }) => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    margin: 'auto',
    marginBottom: spacing(4),
  },
  formError: {
    margin: spacing(2, 0),
  },
  submit: {
    marginTop: spacing(1),
  },
  loginLink: {
    display: 'block',
    marginTop: spacing(1),
  },
}));

interface RegisterInputFields extends RegisterInput {
  confirmPassword: string;
}

export type RegisterFormProps = Pick<
  FormProps<RegisterInputFields>,
  'onSubmit' | 'initialValues'
> & { className?: string };

export const RegisterForm = ({ className, ...props }: RegisterFormProps) => {
  const classes = useStyles();
  return (
    <>
      <div className={className}>
        <div className={classes.header}>
          <CordIcon className={classes.icon} />
          <Typography variant="h4" gutterBottom={true}>
            CORD FIELD
          </Typography>
          <Typography color="textSecondary">
            Accelerating Bible Translation
          </Typography>
        </div>
        <Form
          {...props}
          validate={passwordMatching}
          decorators={decorators}
          mutators={{ markConfirmPasswordTouched }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <SubmitError className={classes.formError} />
              <TextField
                name="realFirstName"
                label="First Name"
                placeholder="Enter First Name"
                required
                validate={minLength(2)}
              />
              <TextField
                name="realLastName"
                label="Last Name"
                placeholder="Enter Last Name"
                required
                validate={minLength(2)}
              />
              <TextField
                name="displayFirstName"
                label="Public First Name"
                placeholder="Enter Public First Name"
                required
                validate={minLength(2)}
              />
              <TextField
                name="displayLastName"
                label="Public Last Name"
                placeholder="Enter Public Last Name"
                required
                validate={minLength(2)}
              />
              <EmailField caseSensitive />
              <PasswordField />
              <PasswordField
                name="confirmPassword"
                label="Re-Type Password"
                placeholder="Re-Enter Your Password"
              />
              <SubmitButton className={classes.submit}>Sign Up</SubmitButton>
            </form>
          )}
        </Form>
        <Link to="/login" className={classes.loginLink}>
          Already have an account? Login
        </Link>
      </div>
    </>
  );
};

const passwordMatching = ({
  password,
  confirmPassword,
  ..._otherVals
}: RegisterInputFields) => {
  return password && confirmPassword && password !== confirmPassword
    ? {
        password: 'Passwords must match',
        confirmPassword: 'Passwords must match',
      }
    : undefined;
};

const showMatchingErrorsImmediately: Decorator<RegisterInputFields> = (form) =>
  form.subscribe(
    ({ active, values }) => {
      if (active === 'confirmPassword' && values.confirmPassword) {
        form.mutators.markConfirmPasswordTouched();
      }
    },
    { active: true, values: true }
  );

const markConfirmPasswordTouched: Mutator<RegisterInputFields> = (
  args,
  state
) => {
  state.fields.confirmPassword.touched = true;
};

// decorators get re-created if array identity changes
// so make constant outside of render function
const decorators = [
  matchFieldIfSame('realFirstName', 'displayFirstName'),
  matchFieldIfSame('realLastName', 'displayLastName'),
  showMatchingErrorsImmediately,
  blurOnSubmit,
  focusFirstFieldWithSubmitError,
];
