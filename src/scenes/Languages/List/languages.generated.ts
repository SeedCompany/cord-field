/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import { LanguageListItemFragment } from '../../../components/LanguageListItemCard/LanguageListItem.generated';
import { LanguageListItemFragmentDoc } from '../../../components/LanguageListItemCard/LanguageListItem.generated';

export type LanguagesQueryVariables = Types.Exact<{
  input: Types.LanguageListInput;
}>;

export interface LanguagesQuery {
  readonly languages: { readonly __typename?: 'LanguageListOutput' } & Pick<
    Types.LanguageListOutput,
    'hasMore' | 'total'
  > & {
      readonly items: ReadonlyArray<
        { readonly __typename?: 'Language' } & LanguageListItemFragment
      >;
    };
}

export const LanguagesDocument = gql`
  query Languages($input: LanguageListInput!) {
    languages(input: $input) {
      items {
        ...LanguageListItem
      }
      hasMore
      total
    }
  }
  ${LanguageListItemFragmentDoc}
`;

/**
 * __useLanguagesQuery__
 *
 * To run a query within a React component, call `useLanguagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useLanguagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLanguagesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLanguagesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    LanguagesQuery,
    LanguagesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<LanguagesQuery, LanguagesQueryVariables>(
    LanguagesDocument,
    baseOptions
  );
}
export function useLanguagesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    LanguagesQuery,
    LanguagesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<LanguagesQuery, LanguagesQueryVariables>(
    LanguagesDocument,
    baseOptions
  );
}
export type LanguagesQueryHookResult = ReturnType<typeof useLanguagesQuery>;
export type LanguagesLazyQueryHookResult = ReturnType<
  typeof useLanguagesLazyQuery
>;
export type LanguagesQueryResult = ApolloReactCommon.QueryResult<
  LanguagesQuery,
  LanguagesQueryVariables
>;
