import {
  ApolloClient,
  ApolloLink,
  ApolloProvider as BaseApolloProvider,
  getApolloContext,
  HttpLink,
  InMemoryCache,
  TypePolicies,
} from '@apollo/client';
import React, { FC, useContext, useState } from 'react';
import { possibleTypes } from './fragmentMatcher.generated';
import { delayLink } from './links/delay.link';
import { ErrorCache, ErrorCacheLink } from './links/errorCache.link';
import { useErrorRendererLink } from './links/renderErrors.link';
import { SessionLink } from './links/session.link';
import { typePolicies } from './typePolicies';

const serverHost = process.env.RAZZLE_API_BASE_URL || '';

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
      uri: `${serverHost}/graphql`,
      credentials: 'include',
    });

    const sessionLink = new SessionLink();

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
    const errorCache: ErrorCache = (window as any).__APOLLO_ERRORS__ || {};

    const client = new ApolloClient({
      cache,
      link: ApolloLink.from([
        errorRendererLink,
        delayLink,
        new ErrorCacheLink(errorCache),
        sessionLink,
        httpLink,
      ]),
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
