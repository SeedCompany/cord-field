import { Button, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& h3': {
      fontWeight: 'bold',
    },
  },
  button: {
    height: spacing(4),
    width: spacing(16),
    marginTop: spacing(2),
  },
}));

export const Error = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography>Oops, Sorry.</Typography>
      <Typography variant="h3">ERROR</Typography>
      <Button
        variant="contained"
        color="secondary"
        classes={{ root: classes.button }}
      >
        Back
      </Button>
    </div>
  );
};
