// eslint-disable-next-line @seedcompany/no-restricted-imports
import { useQuery as useApolloQuery } from '@apollo/client';

/**
 * Apollo's `useQuery`, defaulted to NOT run during server-side rendering.
 *
 * Pass `ssr: true` to opt a query into the server render — see
 * `components/Session/Session.tsx`, currently the only such query.
 *
 * Replaces the `disableSsrByDefault` babel plugin. `ssr` is a React-only option
 * read straight off the hook's second argument, so it cannot be defaulted
 * through `ApolloClient`'s `defaultOptions`.
 */
export const useQuery = ((query: any, options?: any) =>
  useApolloQuery(query, { ssr: false, ...options })) as typeof useApolloQuery;
