import { ErrorHandler } from '@apollo/client/link/error';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { ProviderContext as Snackbar, useSnackbar } from 'notistack';
import { useRef } from 'react';

export const useErrorRendererRef = () => {
  // Using ref to store error handler function, so it can be swapped on each
  // render with one that has access to the current snackbar functions.
  // (While still allowing use of the same single link)
  const errorRendererRef = useRef<ErrorHandler>();
  errorRendererRef.current = errorRenderer(useSnackbar());

  return errorRendererRef;
};

const errorRenderer =
  ({ enqueueSnackbar, closeSnackbar }: Snackbar): ErrorHandler =>
  ({ graphQLErrors, networkError, response, operation }) => {
    if (process.env.NODE_ENV === 'production') {
      // Ensure LogRocket gets some helpful info
      console.error({ graphQLErrors, networkError, response, operation });
    }

    if (networkError?.message === 'Failed to fetch') {
      enqueueSnackbar('Unable to communicate with CORD Platform', {
        variant: 'error',
        preventDuplicate: true,
      });
      return;
    }

    for (const gqlError of graphQLErrors || []) {
      const codes = new Set(gqlError.extensions.codes as string[]);
      const stacktrace = (gqlError.extensions.stacktrace ?? []) as string[];

      // don't show client errors unless they are API communication related
      if (codes.has('Client') && !codes.has('GraphQL')) {
        continue;
      }

      if (stacktrace.length > 0) {
        console.error(stacktrace.join('\n'));
      }
      enqueueSnackbar(gqlError.message, {
        variant: 'error',
        persist: true,
        action: (key) => (
          <IconButton color="inherit" onClick={() => closeSnackbar(key)}>
            <Close />
          </IconButton>
        ),
      });
    }
  };
