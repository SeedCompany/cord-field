import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    margin: spacing(4),
  },
  text: {
    lineHeight: 1.5,
  },
}));

export const PreviewNotSupported = () => {
  const classes = useStyles();
  return (
    <Box className={classes.container} textAlign="center">
      <Typography variant="h3" className={classes.text}>
        Previewing is not supported
        <br />
        for this file type
      </Typography>
    </Box>
  );
};
