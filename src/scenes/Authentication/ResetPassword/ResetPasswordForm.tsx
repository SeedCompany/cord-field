import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import {
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

export type ResetPasswordFormProps = Pick<
  FormProps<{ password: string }>,
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
      <Form {...props}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <SubmitError className={classes.formError} />
            <PasswordField
              label="New Password"
              placeholder="Create New Password"
              autoFocus
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
