import {
  ApolloClient,
  ApolloProvider as BaseApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import React, { FC, useState } from 'react';

const serverHost = process.env.REACT_APP_API_BASE_URL || '';

export const ApolloProvider: FC = ({ children }) => {
  // Client is created only once.
  const [client] = useState(() => {
    const httpLink = new HttpLink({
      uri: `${serverHost}/graphql`,
      credentials: 'include',
    });

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: httpLink,
    });
  });

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
};
