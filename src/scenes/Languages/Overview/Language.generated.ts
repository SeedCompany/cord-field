/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export interface LanguageQueryVariables {
  input: Types.Scalars['ID'];
}

export type LanguageQuery = { __typename?: 'Query' } & {
  language: { __typename?: 'Language' } & Pick<
    Types.Language,
    'id' | 'createdAt'
  > & {
      name: { __typename?: 'SecuredString' } & Pick<
        Types.SecuredString,
        'value' | 'canEdit'
      >;
      displayName: { __typename?: 'SecuredString' } & Pick<
        Types.SecuredString,
        'value' | 'canEdit'
      >;
      beginFiscalYear?: Types.Maybe<
        { __typename?: 'SecuredInt' } & Pick<
          Types.SecuredInt,
          'value' | 'canEdit'
        >
      >;
      ethnologueName?: Types.Maybe<
        { __typename?: 'SecuredString' } & Pick<
          Types.SecuredString,
          'value' | 'canEdit'
        >
      >;
      ethnologuePopulation?: Types.Maybe<
        { __typename?: 'SecuredInt' } & Pick<
          Types.SecuredInt,
          'value' | 'canEdit'
        >
      >;
      organizationPopulation?: Types.Maybe<
        { __typename?: 'SecuredInt' } & Pick<
          Types.SecuredInt,
          'value' | 'canEdit'
        >
      >;
      rodNumber?: Types.Maybe<
        { __typename?: 'SecuredInt' } & Pick<
          Types.SecuredInt,
          'value' | 'canEdit'
        >
      >;
    };
};

export const LanguageDocument = gql`
  query Language($input: ID!) {
    language(id: $input) {
      id
      createdAt
      name {
        value
        canEdit
      }
      displayName {
        value
        canEdit
      }
      beginFiscalYear {
        value
        canEdit
      }
      ethnologueName {
        value
        canEdit
      }
      ethnologuePopulation {
        value
        canEdit
      }
      organizationPopulation {
        value
        canEdit
      }
      rodNumber {
        value
        canEdit
      }
    }
  }
`;

/**
 * __useLanguageQuery__
 *
 * To run a query within a React component, call `useLanguageQuery` and pass it any options that fit your needs.
 * When your component renders, `useLanguageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLanguageQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLanguageQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    LanguageQuery,
    LanguageQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<LanguageQuery, LanguageQueryVariables>(
    LanguageDocument,
    baseOptions
  );
}
export function useLanguageLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    LanguageQuery,
    LanguageQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<LanguageQuery, LanguageQueryVariables>(
    LanguageDocument,
    baseOptions
  );
}
export type LanguageQueryHookResult = ReturnType<typeof useLanguageQuery>;
export type LanguageLazyQueryHookResult = ReturnType<
  typeof useLanguageLazyQuery
>;
export type LanguageQueryResult = ApolloReactCommon.QueryResult<
  LanguageQuery,
  LanguageQueryVariables
>;
