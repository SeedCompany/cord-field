import { Button, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { useNavigate } from 'react-router';

interface ErrorProps {
  variant?: 'Error' | '404';
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

export const Error: FC<ErrorProps> = ({ variant = 'Error' }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.container}>
      <Typography>Oops, Sorry.</Typography>
      <Typography variant="h3" className={classes.boldText}>
        {error ? 'ERROR' : 'PAGE NOT FOUND'}
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
