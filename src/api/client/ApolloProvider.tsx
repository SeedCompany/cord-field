import {
  ApolloClient,
  ApolloLink,
  ApolloProvider as BaseApolloProvider,
  getApolloContext,
  HttpLink,
  InMemoryCache,
  PossibleTypesMap,
  TypePolicies,
} from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import fetch from 'cross-fetch';
import React, { FC, useContext, useState } from 'react';
import { possibleTypes } from '../schema/fragmentMatcher';
import { typePolicies } from '../schema/typePolicies';
import { dedupeFragmentsPrinter } from './dedupeFragmentsPrinter';
import { delayLink } from './links/delay.link';
import { ErrorCache, ErrorCacheLink } from './links/errorCache.link';
import { useErrorRendererLink } from './links/renderErrors.link';
import { SessionLink } from './links/session.link';

const serverHost = process.env.RAZZLE_API_BASE_URL || '';

export const createCache = () => {
  // @ts-expect-error since we use `as const` we need to convert the readonly arrays
  // of specific strings to arrays of any strings.
  const pt: PossibleTypesMap = possibleTypes;

  // Our "strict type" allows for partials. Due to a TS limitation, partials
  // could be missing keys or keys with a value of undefined. We are going
  // to assume that the values will never explicitly be undefined, but rather
  // just omitted.
  const tp = typePolicies as TypePolicies;

  return new InMemoryCache({
    possibleTypes: pt,
    typePolicies: tp,
  });
};

export const ApolloProvider: FC = ({ children }) => {
  const parentContext = useContext(getApolloContext());
  const errorRendererLink = useErrorRendererLink();

  // Client is created only once.
  const [client] = useState(() => {
    // Use parent if it's already defined
    if (parentContext.client) {
      return parentContext.client;
    }

    const httpLink = new HttpLink({
      uri: (op) => `${serverHost}/graphql/${op.operationName}`,
      credentials: 'include',
      fetch,
      print: dedupeFragmentsPrinter,
    });

    const sessionLink = new SessionLink();

    const cache = createCache();

    const initialState = (window as any).__APOLLO_STATE__;
    if (initialState) {
      cache.restore(initialState);
    }
    const errorCache: ErrorCache = (window as any).__APOLLO_ERRORS__ || {};

    const client = new ApolloClient({
      cache,
      link: ApolloLink.from([
        errorRendererLink,
        delayLink,
        new ErrorCacheLink(errorCache),
        sessionLink,
        new RetryLink(),
        httpLink,
      ]),
      connectToDevTools: true,
    });
    sessionLink.client = client;

    return client;
  });

  // Don't redefine provider if client is already defined, essentially making
  // this provider a noop.
  if (parentContext.client) {
    return <>{children}</>;
  }

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
};
