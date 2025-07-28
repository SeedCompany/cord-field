import { Report as ErrorIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { SnackbarProvider as BaseSnackbarProvider } from 'notistack';
import { ChildrenProp } from '~/common';

const StyledSnackbarProvider = styled(BaseSnackbarProvider)(({ theme }) => ({
  '&.SnackbarItem-variantSuccess': {
    backgroundColor: theme.palette.success.main,
  },
  '&.SnackbarItem-variantError': {
    backgroundColor: theme.palette.error.main,
  },
  '&.SnackbarItem-variantInfo': {
    backgroundColor: theme.palette.info.main,
  },
  '&.SnackbarItem-variantWarning': {
    backgroundColor: theme.palette.warning.main,
  },
}));

const icons = {
  error: <ErrorIcon style={{ fontSize: 20, marginInlineEnd: 8 }} />,
};

export const SnackbarProvider = ({ children }: ChildrenProp) => {
  return <StyledSnackbarProvider children={children} iconVariant={icons} />;
};
