/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as Apollo from '@apollo/client';
import gql from 'graphql-tag';
import type * as Types from '../../../../api/schema.generated';

export type UserLookupQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
}>;

export interface UserLookupQuery {
  readonly search: { readonly __typename?: 'SearchOutput' } & {
    readonly items: ReadonlyArray<
      | { readonly __typename?: 'Organization' }
      | { readonly __typename?: 'Country' }
      | { readonly __typename?: 'Region' }
      | { readonly __typename?: 'Zone' }
      | { readonly __typename?: 'Language' }
      | { readonly __typename?: 'TranslationProject' }
      | { readonly __typename?: 'InternshipProject' }
      | ({ readonly __typename?: 'User' } & UserLookupItemFragment)
      | { readonly __typename?: 'Film' }
      | { readonly __typename?: 'Story' }
      | { readonly __typename?: 'LiteracyMaterial' }
      | { readonly __typename?: 'Song' }
    >;
  };
}

export type UserLookupItemFragment = { readonly __typename?: 'User' } & Pick<
  Types.User,
  'id' | 'fullName'
>;

export const UserLookupItemFragmentDoc = gql`
  fragment UserLookupItem on User {
    id
    fullName
  }
`;
export const UserLookupDocument = gql`
  query UserLookup($query: String!) {
    search(input: { query: $query, type: [User] }) {
      items {
        ... on User {
          ...UserLookupItem
        }
      }
    }
  }
  ${UserLookupItemFragmentDoc}
`;

/**
 * __useUserLookupQuery__
 *
 * To run a query within a React component, call `useUserLookupQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserLookupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserLookupQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useUserLookupQuery(
  baseOptions?: Apollo.QueryHookOptions<
    UserLookupQuery,
    UserLookupQueryVariables
  >
) {
  return Apollo.useQuery<UserLookupQuery, UserLookupQueryVariables>(
    UserLookupDocument,
    baseOptions
  );
}
export function useUserLookupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserLookupQuery,
    UserLookupQueryVariables
  >
) {
  return Apollo.useLazyQuery<UserLookupQuery, UserLookupQueryVariables>(
    UserLookupDocument,
    baseOptions
  );
}
export type UserLookupQueryHookResult = ReturnType<typeof useUserLookupQuery>;
export type UserLookupLazyQueryHookResult = ReturnType<
  typeof useUserLookupLazyQuery
>;
export type UserLookupQueryResult = Apollo.QueryResult<
  UserLookupQuery,
  UserLookupQueryVariables
>;
