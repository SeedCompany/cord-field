import { Grid, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';

const useStyles = makeStyles(({ breakpoints }) => ({
  text: {
    maxWidth: breakpoints.values.sm,
    textAlign: 'center',
  },
}));

interface PreviewErrorProps {
  errorText: string;
}

export const PreviewError: FC<PreviewErrorProps> = (props) => {
  const { errorText } = props;
  const classes = useStyles();
  return (
    <Grid item>
      <Typography variant="h3" color="textSecondary" className={classes.text}>
        {errorText}
      </Typography>
    </Grid>
  );
};
