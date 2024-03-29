import { Report as ErrorIcon } from '@mui/icons-material';
import { SnackbarProvider as BaseSnackbarProvider } from 'notistack';
import { makeStyles } from 'tss-react/mui';
import { ChildrenProp } from '~/common';

const useStyles = makeStyles()(({ palette }) => ({
  /* eslint-disable tss-unused-classes/unused-classes */
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
  /* eslint-enable tss-unused-classes/unused-classes */
}));

const icons = {
  error: <ErrorIcon style={{ fontSize: 20, marginInlineEnd: 8 }} />,
};

export const SnackbarProvider = ({ children }: ChildrenProp) => {
  const { classes } = useStyles();
  return (
    <BaseSnackbarProvider
      classes={classes}
      children={children}
      iconVariant={icons}
    />
  );
};
