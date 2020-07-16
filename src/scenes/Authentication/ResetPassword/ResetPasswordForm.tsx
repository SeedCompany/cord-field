import { makeStyles, Typography } from '@material-ui/core';
import { Decorator, Mutator } from 'final-form';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import {
  blurOnSubmit,
  focusFirstFieldWithSubmitError,
  PasswordField,
  SubmitButton,
  SubmitError,
} from '../../../components/form';
import { Link } from '../../../components/Routing';

const useStyles = makeStyles(({ spacing }) => ({
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
    display: 'block',
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
> & { className?: string };

export const ResetPasswordForm = ({
  className,
  ...props
}: ResetPasswordFormProps) => {
  const classes = useStyles();

  return (
    <div className={className}>
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
    </div>
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
        form.mutators.markConfirmTouched();
      }
    },
    { active: true, values: true }
  );

const markConfirmTouched: Mutator<Fields> = (args, state) => {
  state.fields.confirm.touched = true;
};

const decorators = [
  showMatchingErrorsImmediately,
  blurOnSubmit,
  focusFirstFieldWithSubmitError,
];
