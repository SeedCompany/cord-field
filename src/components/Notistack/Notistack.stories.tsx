import { Button } from '@material-ui/core';
import { number, select, text } from '@storybook/addon-knobs';
import { SnackbarProvider, useSnackbar } from 'notistack';
import * as React from 'react';
import { FC } from 'react';

export default { title: 'Components/Notistack' };

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

export const Notistack = () => (
  <SnackbarProvider maxSnack={number('Max Snack', 1)}>
    <NT
      message={text('Message', 'Your notification here!')}
      variant={select('Type', ['success', 'info', 'warning'], 'success')}
    />
  </SnackbarProvider>
);
