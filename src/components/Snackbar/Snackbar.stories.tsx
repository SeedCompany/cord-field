import { Button } from '@material-ui/core';
import { select, text } from '@storybook/addon-knobs';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { FC } from 'react';
import { SnackbarProvider } from './SnackbarProvider';

export default { title: 'Components/Snackbar' };

interface SnackbarProps {
  message: string;
  variant?: 'success' | 'info' | 'warning';
}

const NT: FC<SnackbarProps> = ({ ...props }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    enqueueSnackbar(props.message, {
      variant: props.variant,
    });
  };

  return (
    <Button onClick={handleClick} color="primary" variant="contained">
      Click Me
    </Button>
  );
};

export const Basic = () => (
  <SnackbarProvider>
    <NT
      message={text('Message', 'Your notification here!')}
      variant={select('Type', ['success', 'info', 'warning'], 'success')}
    />
  </SnackbarProvider>
);
