import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { ButtonLink } from '../../../components/Routing';

const useStyles = makeStyles(({ spacing }) => ({
  title: {
    marginBottom: spacing(3),
  },
  body: {
    marginBottom: spacing(5),
  },
}));

export const ForgotPasswordSuccess = ({
  email,
  className,
}: {
  email: string;
  className?: string;
}) => {
  const classes = useStyles();
  return (
    <div className={className}>
      <Typography variant="h3" align="center" className={classes.title}>
        Check Your Email
      </Typography>
      <Typography align="center" className={classes.body}>
        Please check the email address {email} for instructions to reset your
        password.
      </Typography>
      <ButtonLink
        to="/login"
        color="secondary"
        size="large"
        variant="contained"
        fullWidth
      >
        Back to Log In
      </ButtonLink>
    </div>
  );
};
