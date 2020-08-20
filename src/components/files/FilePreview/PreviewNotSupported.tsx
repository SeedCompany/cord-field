import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    display: 'flex',
    margin: spacing(4),
    textAlign: 'center',
  },
  text: {
    lineHeight: 1.5,
  },
}));

export const PreviewNotSupported = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="h3" className={classes.text}>
        Previewing is not supported
        <br />
        for this file type
      </Typography>
    </div>
  );
};
