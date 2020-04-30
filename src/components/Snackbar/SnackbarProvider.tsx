import { makeStyles } from '@material-ui/core';
import { SnackbarProvider as BaseSnackbarProvider } from 'notistack';
import * as React from 'react';
import { FC } from 'react';

const useStyles = makeStyles(({ palette }) => ({
  variantSuccess: {
    backgroundColor: palette.success.main,
  },
  variantError: {
    backgroundColor: palette.error.main,
  },
  variantInfo: {
    backgroundColor: palette.info.main,
  },
  variantWarning: {
    backgroundColor: palette.warning.main,
  },
}));

export const SnackbarProvider: FC = ({ children }) => {
  const classes = useStyles();
  return <BaseSnackbarProvider classes={classes} children={children} />;
};
