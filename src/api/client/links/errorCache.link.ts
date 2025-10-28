import { ApolloLink, fromPromise } from '@apollo/client';
import { GraphQLFormattedError } from 'graphql';

export type ErrorCache = Record<
  string,
  readonly GraphQLFormattedError[] | undefined
>;

/**
 * This allows to errors to be cached & reused without going to the network.
 * This is mainly for SSR requests so the client doesn't have to refetch them.
 *
 * Note that React will still warn about invalid server HTML, because the
 * useQuery hook will think it is loading it from the network on init.
 * Immediately following however, the error is given to the hook. From my testing,
 * the loading state never gets a chance to render, so this looks seamless
 * from the users perspective.
 */
export class ErrorCacheLink extends ApolloLink {
  constructor(store: ErrorCache, write = false) {
    super((operation, forward) => {
      const opCacheKey =
        operation.operationName + ':' + JSON.stringify(operation.variables);

      if (store[opCacheKey]) {
        return fromValue({
          errors: store[opCacheKey],
        });
      }

      return forward(operation).map((res) => {
        if (write && res.errors && res.errors.length > 0) {
          store[opCacheKey] = res.errors;
        }
        return res;
      });
    });
  }
}

const fromValue = <T extends any>(value: T) =>
  fromPromise(Promise.resolve(value));
