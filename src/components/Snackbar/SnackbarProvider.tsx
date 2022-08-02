import { makeStyles } from '@material-ui/core';
import { Report as ErrorIcon } from '@material-ui/icons';
import { SnackbarProvider as BaseSnackbarProvider } from 'notistack';
import { ChildrenProp } from '~/common';

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

const icons = {
  error: <ErrorIcon style={{ fontSize: 20, marginInlineEnd: 8 }} />,
};

export const SnackbarProvider = ({ children }: ChildrenProp) => {
  const classes = useStyles();
  return (
    <BaseSnackbarProvider
      classes={classes}
      children={children}
      iconVariant={icons}
    />
  );
};
