import { ApolloError } from '@apollo/client';
import { Button, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { useNavigate } from 'react-router';

interface ErrorProps {
  error?: ApolloError;
}

const useStyles = makeStyles(({ spacing, typography }) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  errorType: {
    display: 'flex',
  },
  boldText: {
    fontWeight: typography.weight.bold,
    marginRight: spacing(1),
  },
  button: {
    marginTop: spacing(2),
  },
}));

export const Error: FC<ErrorProps> = ({ error }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const isNotFoundError = error?.graphQLErrors.some(
    (error) => error.extensions?.code === 'NOT_FOUND'
  );

  return (
    <div className={classes.container}>
      <Typography>Oops, Sorry.</Typography>
      <Typography variant="h3" className={classes.boldText}>
        {isNotFoundError ? 'PAGE NOT FOUND' : 'ERROR'}
      </Typography>
      <Button
        onClick={() => navigate(-1)}
        variant="contained"
        color="secondary"
        className={classes.button}
      >
        Back
      </Button>
    </div>
  );
};
