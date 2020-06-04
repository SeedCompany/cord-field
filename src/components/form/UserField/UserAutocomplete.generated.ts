/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export interface UserAutocompleteQueryVariables {
  input: Types.UserListInput;
}

export type UserAutocompleteQuery = { __typename?: 'Query' } & {
  users: { __typename?: 'UserListOutput' } & {
    items: Array<{ __typename?: 'User' } & Pick<Types.User, 'id' | 'fullName'>>;
  };
};

export const UserAutocompleteDocument = gql`
  query UserAutocomplete($input: UserListInput!) {
    users(input: $input) {
      items {
        id
        fullName
      }
    }
  }
`;

/**
 * __useUserAutocompleteQuery__
 *
 * To run a query within a React component, call `useUserAutocompleteQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserAutocompleteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserAutocompleteQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserAutocompleteQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UserAutocompleteQuery,
    UserAutocompleteQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    UserAutocompleteQuery,
    UserAutocompleteQueryVariables
  >(UserAutocompleteDocument, baseOptions);
}
export function useUserAutocompleteLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UserAutocompleteQuery,
    UserAutocompleteQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    UserAutocompleteQuery,
    UserAutocompleteQueryVariables
  >(UserAutocompleteDocument, baseOptions);
}
export type UserAutocompleteQueryHookResult = ReturnType<
  typeof useUserAutocompleteQuery
>;
export type UserAutocompleteLazyQueryHookResult = ReturnType<
  typeof useUserAutocompleteLazyQuery
>;
export type UserAutocompleteQueryResult = ApolloReactCommon.QueryResult<
  UserAutocompleteQuery,
  UserAutocompleteQueryVariables
>;
