/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type SessionQueryVariables = Types.Exact<{ [key: string]: never }>;

export interface SessionQuery {
  readonly session: { readonly __typename?: 'SessionOutput' } & {
    readonly user?: Types.Maybe<
      { readonly __typename?: 'User' } & LoggedInUserFragment
    >;
  };
}

export type LoggedInUserFragment = { readonly __typename?: 'User' } & Pick<
  Types.User,
  'id'
> & {
    readonly email: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    readonly timezone: { readonly __typename?: 'SecuredTimeZone' } & {
      readonly value?: Types.Maybe<
        { readonly __typename?: 'TimeZone' } & Pick<Types.TimeZone, 'name'>
      >;
    };
    readonly realFirstName: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    readonly realLastName: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    readonly displayFirstName: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    readonly displayLastName: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
  };

export const LoggedInUserFragmentDoc = gql`
  fragment LoggedInUser on User {
    id
    email {
      value
    }
    timezone {
      value {
        name
      }
    }
    realFirstName {
      value
    }
    realLastName {
      value
    }
    displayFirstName {
      value
    }
    displayLastName {
      value
    }
  }
`;
export const SessionDocument = gql`
  query Session {
    session(browser: true) {
      user {
        ...LoggedInUser
      }
    }
  }
  ${LoggedInUserFragmentDoc}
`;

/**
 * __useSessionQuery__
 *
 * To run a query within a React component, call `useSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSessionQuery({
 *   variables: {
 *   },
 * });
 */
export function useSessionQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SessionQuery,
    SessionQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<SessionQuery, SessionQueryVariables>(
    SessionDocument,
    baseOptions
  );
}
export function useSessionLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SessionQuery,
    SessionQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<SessionQuery, SessionQueryVariables>(
    SessionDocument,
    baseOptions
  );
}
export type SessionQueryHookResult = ReturnType<typeof useSessionQuery>;
export type SessionLazyQueryHookResult = ReturnType<typeof useSessionLazyQuery>;
export type SessionQueryResult = ApolloReactCommon.QueryResult<
  SessionQuery,
  SessionQueryVariables
>;
