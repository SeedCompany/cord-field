import { Report as ErrorIcon } from '@mui/icons-material';
import { Box } from '@mui/material';
import { SnackbarProvider as BaseSnackbarProvider } from 'notistack';
import { ChildrenProp } from '~/common';

const icons = {
  error: <ErrorIcon style={{ fontSize: 20, marginInlineEnd: 8 }} />,
};

export const SnackbarProvider = ({ children }: ChildrenProp) => {
  return (
    <Box
      component={BaseSnackbarProvider}
      children={children}
      iconVariant={icons}
      maxSnack={10}
      sx={(theme) => ({
        '&.SnackbarItem-variantInfo': {
          backgroundColor: theme.palette.info.main,
        },
        '&.SnackbarItem-variantSuccess': {
          backgroundColor: theme.palette.success.main,
        },
        '&.SnackbarItem-variantWarning': {
          backgroundColor: theme.palette.warning.main,
        },
        '&.SnackbarItem-variantError': {
          backgroundColor: theme.palette.error.main,
        },
      })}
    />
  );
};
