import {
  ApolloProvider as BaseApolloProvider,
  getApolloContext,
} from '@apollo/client';
import { useLatest } from 'ahooks';
import { useContext, useEffect, useRef, useState } from 'react';
import { ChildrenProp } from '~/common';
import { createClient } from './createClient';
import { ImpersonationContext } from './ImpersonationContext';
import { useErrorRendererRef } from './links/renderErrors.link';

export const ApolloProvider = ({ children }: ChildrenProp) => {
  const parentContext = useContext(getApolloContext());
  const errorRendererRef = useErrorRendererRef();
  const impersonation = useContext(ImpersonationContext);
  const impersonationRef = useLatest(impersonation);

  // Client is created only once.
  const [client] = useState(() => {
    // Use parent if it's already defined
    if (parentContext.client) {
      return parentContext.client;
    }

    return createClient({
      errorRenderer: errorRendererRef,
      impersonation: impersonationRef,
    });
  });

  // Reset store when impersonation changes
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    void client.resetStore();
  }, [
    client,
    firstRender,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [impersonation.user, ...(impersonation.roles ?? [])].join(','),
  ]);

  // Don't redefine provider if client is already defined, essentially making
  // this provider a noop.
  if (parentContext.client) {
    return <>{children}</>;
  }

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
};
