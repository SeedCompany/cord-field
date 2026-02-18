import { ApolloClient, ApolloLink, split } from '@apollo/client';
import { ErrorHandler, onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { RefObject } from 'react';
import { createCache } from './createCache';
import { Impersonation } from './ImpersonationContext';
import { delayLink } from './links/delay.link';
import { ErrorCache, ErrorCacheLink } from './links/errorCache.link';
import { createHttpLink, createSseLink } from './links/http.link';
import { createImpersonationLink } from './links/impersonation.link';
import { createPersistedQueryLink } from './links/persisted-queries.link';
import { SessionLink } from './links/session.link';
import { isLive } from './links/sse.link';
import { createSsrLink, SsrLinkProps } from './links/ssr.link';

export const createClient = ({
  errorCache,
  ssr,
  errorRenderer,
  impersonation,
}: {
  ssr?: SsrLinkProps;
  errorCache?: ErrorCache;
  errorRenderer?: RefObject<ErrorHandler | undefined>;
  impersonation?: RefObject<Impersonation | undefined>;
}) => {
  const sessionLink = new SessionLink();

  const client = new ApolloClient({
    clientAwareness: {
      name: 'cord-field',
      version: process.env.RAZZLE_GIT_HASH,
    },
    ssrMode: !!ssr,
    cache: createCache(),
    link: ApolloLink.from([
      onError((error) => errorRenderer?.current?.(error)),
      delayLink,
      new ErrorCacheLink(
        errorCache ?? ((window as any).__APOLLO_ERRORS__ || {}),
        !!ssr
      ),
      createImpersonationLink(impersonation),
      ssr ? createSsrLink(ssr) : sessionLink,
      new RetryLink(),
      createPersistedQueryLink(),
      split(isLive, createSseLink(), createHttpLink()),
    ]),
  });
  sessionLink.client = client;

  return client;
};
