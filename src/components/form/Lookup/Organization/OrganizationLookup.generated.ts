/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as Apollo from '@apollo/client';
import gql from 'graphql-tag';
import type * as Types from '../../../../api/schema.generated';

export type OrganizationLookupQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
}>;

export interface OrganizationLookupQuery {
  readonly search: { readonly __typename?: 'SearchOutput' } & {
    readonly items: ReadonlyArray<
      | ({
          readonly __typename?: 'Organization';
        } & OrganizationLookupItemFragment)
      | { readonly __typename?: 'Country' }
      | { readonly __typename?: 'Region' }
      | { readonly __typename?: 'Zone' }
      | { readonly __typename?: 'Language' }
      | { readonly __typename?: 'TranslationProject' }
      | { readonly __typename?: 'InternshipProject' }
      | { readonly __typename?: 'User' }
      | { readonly __typename?: 'Film' }
      | { readonly __typename?: 'Story' }
      | { readonly __typename?: 'LiteracyMaterial' }
      | { readonly __typename?: 'Song' }
    >;
  };
}

export type OrganizationLookupItemFragment = {
  readonly __typename?: 'Organization';
} & Pick<Types.Organization, 'id'> & {
    readonly name: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
  };

export const OrganizationLookupItemFragmentDoc = gql`
  fragment OrganizationLookupItem on Organization {
    id
    name {
      value
    }
  }
`;
export const OrganizationLookupDocument = gql`
  query OrganizationLookup($query: String!) {
    search(input: { query: $query, type: [Organization] }) {
      items {
        ... on Organization {
          ...OrganizationLookupItem
        }
      }
    }
  }
  ${OrganizationLookupItemFragmentDoc}
`;

/**
 * __useOrganizationLookupQuery__
 *
 * To run a query within a React component, call `useOrganizationLookupQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationLookupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationLookupQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useOrganizationLookupQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OrganizationLookupQuery,
    OrganizationLookupQueryVariables
  >
) {
  return Apollo.useQuery<
    OrganizationLookupQuery,
    OrganizationLookupQueryVariables
  >(OrganizationLookupDocument, baseOptions);
}
export function useOrganizationLookupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OrganizationLookupQuery,
    OrganizationLookupQueryVariables
  >
) {
  return Apollo.useLazyQuery<
    OrganizationLookupQuery,
    OrganizationLookupQueryVariables
  >(OrganizationLookupDocument, baseOptions);
}
export type OrganizationLookupQueryHookResult = ReturnType<
  typeof useOrganizationLookupQuery
>;
export type OrganizationLookupLazyQueryHookResult = ReturnType<
  typeof useOrganizationLookupLazyQuery
>;
export type OrganizationLookupQueryResult = Apollo.QueryResult<
  OrganizationLookupQuery,
  OrganizationLookupQueryVariables
>;
