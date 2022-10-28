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
      sx={{
        '&.SnackbarItem-variantInfo': {
          backgroundColor: 'info.main',
        },
        '&.SnackbarItem-variantSuccess': {
          backgroundColor: 'success.main',
        },
        '&.SnackbarItem-variantWarning': {
          backgroundColor: 'warning.main',
        },
        '&.SnackbarItem-variantError': {
          backgroundColor: 'error.main',
        },
      }}
    />
  );
};
