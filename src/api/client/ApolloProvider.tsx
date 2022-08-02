import {
  ApolloProvider as BaseApolloProvider,
  getApolloContext,
} from '@apollo/client';
import { useContext, useState } from 'react';
import { ChildrenProp } from '~/common';
import { createClient } from './createClient';
import { useErrorRendererRef } from './links/renderErrors.link';

export const ApolloProvider = ({ children }: ChildrenProp) => {
  const parentContext = useContext(getApolloContext());
  const errorRendererRef = useErrorRendererRef();

  // Client is created only once.
  const [client] = useState(() => {
    // Use parent if it's already defined
    if (parentContext.client) {
      return parentContext.client;
    }

    return createClient({
      errorRenderer: errorRendererRef,
    });
  });

  // Don't redefine provider if client is already defined, essentially making
  // this provider a noop.
  if (parentContext.client) {
    return <>{children}</>;
  }

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
};
