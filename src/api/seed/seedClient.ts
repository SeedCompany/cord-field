import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const seedClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: '/api/seed-proxy' }),
});
