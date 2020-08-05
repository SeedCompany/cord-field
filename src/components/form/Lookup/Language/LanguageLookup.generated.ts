/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as Apollo from '@apollo/client';
import gql from 'graphql-tag';
import type * as Types from '../../../../api/schema.generated';

export type LanguageLookupQueryVariables = Types.Exact<{
  query: Types.Scalars['String'];
}>;

export interface LanguageLookupQuery {
  readonly search: { readonly __typename?: 'SearchOutput' } & {
    readonly items: ReadonlyArray<
      | { readonly __typename?: 'Organization' }
      | { readonly __typename?: 'Country' }
      | { readonly __typename?: 'Region' }
      | { readonly __typename?: 'Zone' }
      | ({ readonly __typename?: 'Language' } & LanguageLookupItemFragment)
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

export type LanguageLookupItemFragment = {
  readonly __typename?: 'Language';
} & Pick<Types.Language, 'id'> & {
    readonly name: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    readonly displayName: { readonly __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
  };

export const LanguageLookupItemFragmentDoc = gql`
  fragment LanguageLookupItem on Language {
    id
    name {
      value
    }
    displayName {
      value
    }
  }
`;
export const LanguageLookupDocument = gql`
  query LanguageLookup($query: String!) {
    search(input: { query: $query, type: [Language] }) {
      items {
        ... on Language {
          ...LanguageLookupItem
        }
      }
    }
  }
  ${LanguageLookupItemFragmentDoc}
`;

/**
 * __useLanguageLookupQuery__
 *
 * To run a query within a React component, call `useLanguageLookupQuery` and pass it any options that fit your needs.
 * When your component renders, `useLanguageLookupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLanguageLookupQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useLanguageLookupQuery(
  baseOptions?: Apollo.QueryHookOptions<
    LanguageLookupQuery,
    LanguageLookupQueryVariables
  >
) {
  return Apollo.useQuery<LanguageLookupQuery, LanguageLookupQueryVariables>(
    LanguageLookupDocument,
    baseOptions
  );
}
export function useLanguageLookupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LanguageLookupQuery,
    LanguageLookupQueryVariables
  >
) {
  return Apollo.useLazyQuery<LanguageLookupQuery, LanguageLookupQueryVariables>(
    LanguageLookupDocument,
    baseOptions
  );
}
export type LanguageLookupQueryHookResult = ReturnType<
  typeof useLanguageLookupQuery
>;
export type LanguageLookupLazyQueryHookResult = ReturnType<
  typeof useLanguageLookupLazyQuery
>;
export type LanguageLookupQueryResult = Apollo.QueryResult<
  LanguageLookupQuery,
  LanguageLookupQueryVariables
>;
