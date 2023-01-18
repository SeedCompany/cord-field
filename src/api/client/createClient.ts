import { ApolloClient, ApolloLink } from '@apollo/client';
import { ErrorHandler, onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { RefObject } from 'react';
import { createCache } from './createCache';
import { delayLink } from './links/delay.link';
import { ErrorCache, ErrorCacheLink } from './links/errorCache.link';
import { createHttpLink } from './links/http.link';
import { createPersistedQueryLink } from './links/persisted-queries.link';
import { SessionLink } from './links/session.link';
import { createSsrLink, SsrLinkProps } from './links/ssr.link';

export const createClient = ({
  errorCache,
  ssr,
  errorRenderer,
}: {
  ssr?: SsrLinkProps;
  errorCache?: ErrorCache;
  errorRenderer?: RefObject<ErrorHandler | undefined>;
}) => {
  const sessionLink = new SessionLink();

  const client = new ApolloClient({
    name: 'cord-field',
    version: process.env.RAZZLE_GIT_HASH,
    ssrMode: !!ssr,
    cache: createCache(),
    link: ApolloLink.from([
      onError((error) => errorRenderer?.current?.(error)),
      delayLink,
      new ErrorCacheLink(
        errorCache ?? ((window as any).__APOLLO_ERRORS__ || {}),
        !!ssr
      ),
      ssr ? createSsrLink(ssr) : sessionLink,
      new RetryLink(),
      createPersistedQueryLink(),
      createHttpLink(),
    ]),
  });
  sessionLink.client = client;

  return client;
};
