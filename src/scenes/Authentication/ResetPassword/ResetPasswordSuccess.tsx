import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { ButtonLink } from '../../../components/Routing/ButtonLink';

const useStyles = makeStyles(({ spacing }) => ({
  title: {
    marginBottom: spacing(3),
  },
  body: {
    marginBottom: spacing(5),
  },
}));

export const ResetPasswordSuccess = ({ className }: { className?: string }) => {
  const classes = useStyles();
  return (
    <div className={className}>
      <Typography variant="h3" align="center" className={classes.title}>
        Your Password Has Been Reset
      </Typography>
      <Typography align="center" className={classes.body}>
        Your password has been saved. Use the link below to log in with your new
        password.
      </Typography>
      <ButtonLink
        to="/login"
        color="secondary"
        size="large"
        variant="contained"
        fullWidth
      >
        Continue to Log In
      </ButtonLink>
    </div>
  );
};
