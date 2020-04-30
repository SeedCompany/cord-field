import { Button, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import { OptionsObject, useSnackbar } from 'notistack';
import { ReactElement } from 'react';
import * as React from 'react';
import { SnackbarProvider } from './SnackbarProvider';

export default {
  title: 'Components/Snackbar',
  decorators: [
    (fn: () => ReactElement) => {
      const Fn = () => <>{fn()}</>; // render fn with provider's context
      return (
        <SnackbarProvider>
          <Fn />
        </SnackbarProvider>
      );
    },
  ],
};

export const Basic = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { message, ...opts } = options();

  return <OpenButton onClick={() => enqueueSnackbar(message, opts)} />;
};

export const Persistent = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { message, ...opts } = options({
    persist: true,
    action: (key) => (
      <IconButton
        color="inherit"
        onClick={() => closeSnackbar(key)}
        aria-label="dismiss"
      >
        <Close />
      </IconButton>
    ),
  });

  return <OpenButton onClick={() => enqueueSnackbar(message, opts)} />;
};

export const WithAction = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { message, ...opts } = options(
    {
      action: () => (
        <Button color="inherit" onClick={action('view')}>
          VIEW
        </Button>
      ),
    },
    {
      message: 'Created item',
      variant: 'success',
    }
  );

  return <OpenButton onClick={() => enqueueSnackbar(message, opts)} />;
};

type Options = OptionsObject & { message: string };
const options = (
  overrides: Partial<Options> = {},
  defaults: Partial<Options> = {}
): Options => ({
  ...defaults,
  ...overrides,
  message:
    overrides.message ??
    text('Message', defaults.message ?? 'Your notification here!'),
  variant:
    overrides.variant ??
    select(
      'Variant',
      ['default', 'success', 'info', 'warning', 'error'],
      defaults.variant ?? 'default'
    ),
  persist: overrides.persist ?? boolean('Persist', defaults.persist ?? false),
  preventDuplicate:
    overrides.preventDuplicate ??
    boolean('Prevent duplicate', defaults.preventDuplicate ?? false),
});

const OpenButton = ({ onClick }: { onClick: () => any }) => (
  <Button onClick={onClick} color="primary" variant="contained">
    Open snackbar
  </Button>
);
