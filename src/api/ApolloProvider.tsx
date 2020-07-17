import {
  ApolloClient,
  ApolloQueryResult,
  ApolloProvider as BaseApolloProvider,
  concat,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
} from '@apollo/client';
import {
  onError as createErrorLink,
  ErrorHandler,
} from '@apollo/client/link/error';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { ProviderContext as Snackbar, useSnackbar } from 'notistack';
import React, { FC, useRef, useState } from 'react';
import { SessionDocument } from '../components/Session/session.generated';
import { possibleTypes } from './fragmentMatcher.generated';
import { typePolicies } from './typePolicies';

const serverHost = process.env.REACT_APP_API_BASE_URL || '';

export const ApolloProvider: FC = ({ children }) => {
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

  // Using ref to store error handler function, so it can be swapped on each
  // render with one that has access to the current snackbar functions.
  // (While still allowing use of the same single client)
  const errorHandlerRef = useRef<ErrorHandler>();
  errorHandlerRef.current = errorHandler(useSnackbar(), client);

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
};

const errorHandler = (
  { enqueueSnackbar, closeSnackbar }: Snackbar,
  client: ApolloClient<NormalizedCacheObject>
): ErrorHandler => ({ graphQLErrors, networkError, operation, forward }) => {
  if (networkError?.message === 'Failed to fetch') {
    enqueueSnackbar('Unable to communicate with CORD Platform', {
      variant: 'error',
      preventDuplicate: true,
    });
    return;
  }

  for (const gqlError of graphQLErrors || []) {
    const ext = gqlError.extensions ?? {};
    const schemaError = ext.code === 'INTERNAL_SERVER_ERROR';

    if (ext.code === 'NoSession' && operation.operationName !== 'Session') {
      // If error code is `NoSession`, we'll re-execute the session query then retry the previous operation
      return queryToObservable(
        client.query({
          query: SessionDocument,
          fetchPolicy: 'network-only',
        })
      ).flatMap(() => forward(operation));
    }

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

/**
 * Used for executing apollo client queries as observables
 * error link cannot support promises - we must return an observable
 * Read here for more info: https://github.com/apollographql/apollo-link/issues/646
 */
function queryToObservable(query: Promise<ApolloQueryResult<any>>) {
  return new Observable((subscriber) => {
    query
      .then((value) => {
        console.log('INSIDE OF PROMISE');
        if (subscriber.closed) return;
        subscriber.next(value);
        subscriber.complete();
      })
      .catch((err) => subscriber.error(err));
  });
}
