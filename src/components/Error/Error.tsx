import { Button, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';

interface ErrorProps {
  navigateBack: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

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

export const Error: FC<ErrorProps> = ({ navigateBack }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography>Oops, Sorry.</Typography>
      <Typography variant="h3">ERROR</Typography>
      <Button
        onClick={navigateBack}
        variant="contained"
        color="secondary"
        classes={{ root: classes.button }}
      >
        Back
      </Button>
    </div>
  );
};
