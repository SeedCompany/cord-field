import {
  ApolloClient,
  ApolloLink,
  ApolloProvider as BaseApolloProvider,
  fromPromise,
  getApolloContext,
  HttpLink,
  InMemoryCache,
  RequestHandler,
  TypePolicies,
} from '@apollo/client';
import {
  onError as createErrorLink,
  ErrorHandler,
} from '@apollo/client/link/error';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { compact } from 'lodash';
import { ProviderContext as Snackbar, useSnackbar } from 'notistack';
import React, { FC, useContext, useRef, useState } from 'react';
import { sleep } from '../util';
import { possibleTypes } from './fragmentMatcher.generated';
import { GQLOperations } from './operations.generated';
import { SessionLink } from './session.link';
import { typePolicies } from './typePolicies';

const serverHost = process.env.RAZZLE_API_BASE_URL || '';

let API_DEBUG = {
  delay: 0,
};
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  let privateDelay = 0;
  API_DEBUG = {
    get delay() {
      return privateDelay;
    },
    set delay(newDelay) {
      privateDelay = newDelay;
      saveState();
    },
  };
  (globalThis as any).API_DEBUG = API_DEBUG;
  const saveState = () =>
    window.history.replaceState({ API_DEBUG }, window.document.title);
  const prev = window.history.state?.API_DEBUG;
  if (prev) {
    API_DEBUG.delay = prev.delay;
  }
}

export const ApolloProvider: FC = ({ children }) => {
  const parentContext = useContext(getApolloContext());

  // Client is created only once.
  const [client] = useState(() => {
    // Use parent if it's already defined
    if (parentContext.client) {
      return parentContext.client;
    }

    const httpLink = new HttpLink({
      uri: `${serverHost}/graphql`,
      credentials: 'include',
    });

    const sessionLink = new SessionLink();

    const errorRendererLink = createErrorLink((error) =>
      errorRendererRef.current?.(error)
    );

    const delayLink: RequestHandler | null =
      process.env.NODE_ENV === 'production'
        ? null
        : (operation, forward) => {
            const currentDelay = API_DEBUG.delay;
            if (
              !currentDelay ||
              operation.operationName === GQLOperations.Query.Session
            ) {
              return forward(operation);
            }
            return fromPromise(sleep(currentDelay)).flatMap(() =>
              forward(operation)
            );
          };

    const cache = new InMemoryCache({
      possibleTypes,
      // Yes the assertion is necessary. It's because, as of TS 4.0, index
      // signatures still incorrectly convey that values for missing keys
      // would still give the expected value instead of undefined, which is
      // absolutely how JS works. I believe this is getting fixed finally in 4.1.
      // See: https://github.com/microsoft/TypeScript/pull/39560
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      typePolicies: typePolicies as TypePolicies,
    });

    const initialState = (window as any).__APOLLO_STATE__;
    if (initialState) {
      cache.restore(initialState);
    }

    const client = new ApolloClient({
      cache,
      link: ApolloLink.from(
        compact([errorRendererLink, delayLink, sessionLink, httpLink])
      ),
    });
    sessionLink.client = client;

    return client;
  });

  // Using ref to store error handler function, so it can be swapped on each
  // render with one that has access to the current snackbar functions.
  // (While still allowing use of the same single client)
  const errorRendererRef = useRef<ErrorHandler>();
  errorRendererRef.current = errorRenderer(useSnackbar());

  // Don't redefine provider if client is already defined, essentially making
  // this provider a noop.
  if (parentContext.client) {
    return <>{children}</>;
  }

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
};

const errorRenderer = ({
  enqueueSnackbar,
  closeSnackbar,
}: Snackbar): ErrorHandler => ({ graphQLErrors, networkError }) => {
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
