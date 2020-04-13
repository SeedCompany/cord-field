import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const serverHost = process.env.REACT_APP_API_BASE_URL || '';

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: `${serverHost}/graphql`,
  }),
});
