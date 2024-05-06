import { ApolloClient, fromPromise } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { SessionDocument } from '~/components/Session/session.graphql';
import { GQLOperations } from '../../operationsList';

declare module '~/api/errorHandling/error.types' {
  interface ErrorMap {
    NoSession: unknown;
  }
}

/**
 * Retry operations on session errors
 */
export class SessionLink extends ErrorLink {
  client?: ApolloClient<unknown>;
  constructor() {
    super(({ graphQLErrors, operation, forward }) => {
      for (const gqlError of graphQLErrors || []) {
        const ext = gqlError.extensions;

        // Re-establish session if needed then retry the operation
        if (
          ext.codes[0] === 'NoSession' &&
          operation.operationName !== GQLOperations.Query.Session
        ) {
          if (!this.client) {
            throw new Error('No client to re-initialize session with');
          }
          return fromPromise(
            this.client.query({
              query: SessionDocument,
              fetchPolicy: 'network-only',
            })
          ).flatMap(() => forward(operation));
        }
      }
    });
  }
}
