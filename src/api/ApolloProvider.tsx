import {
  ApolloClient,
  ApolloProvider as BaseApolloProvider,
  concat,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { onError as createErrorLink, ErrorHandler } from '@apollo/link-error';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { ProviderContext as Snackbar, useSnackbar } from 'notistack';
import React, { FC, useRef, useState } from 'react';
import { possibleTypes } from './fragmentMatcher.generated';
import { typePolicies } from './scalars';

const serverHost = process.env.REACT_APP_API_BASE_URL || '';

export const ApolloProvider: FC = ({ children }) => {
  // Using ref to store error handler function, so it can be swapped on each
  // render with one that has access to the current snackbar functions.
  // (While still allowing use of the same single client)
  const errorHandlerRef = useRef<ErrorHandler>();
  errorHandlerRef.current = errorHandler(useSnackbar());

  // Client is created only once.
  const [client] = useState(() => {
    const httpLink = new HttpLink({
      uri: `${serverHost}/graphql`,
      credentials: 'include',
    });
    const errorLink = createErrorLink((error) =>
      errorHandlerRef.current?.(error)
    );

    return new ApolloClient({
      cache: new InMemoryCache({
        possibleTypes,
        typePolicies,
      }),
      link: concat(errorLink, httpLink),
    });
  });

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
};

const errorHandler = ({
  enqueueSnackbar,
  closeSnackbar,
}: Snackbar): ErrorHandler => (error) => {
  if (error.networkError?.message === 'Failed to fetch') {
    enqueueSnackbar('Unable to communicate with CORD Platform', {
      variant: 'error',
      preventDuplicate: true,
    });
    return;
  }

  for (const gqlError of error.graphQLErrors || []) {
    const ext = gqlError.extensions ?? {};
    const schemaError = ext.code === 'INTERNAL_SERVER_ERROR';
    if (!schemaError && ext.status < 500) {
      continue;
    }
    const trace: string[] = ext.exception?.stacktrace ?? [];
    if (trace.length > 0 && !schemaError) {
      console.error(trace.join('\n'));
    }
    enqueueSnackbar(gqlError.message, {
      variant: 'error',
      persist: true,
      action: (key: string) => (
        <IconButton color="inherit" onClick={() => closeSnackbar(key)}>
          <Close />
        </IconButton>
      ),
    });
  }
};
