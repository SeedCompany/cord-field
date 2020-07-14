/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export interface OrganizationAutocompleteQueryVariables {
  input: Types.OrganizationListInput;
}

export type OrganizationAutocompleteQuery = { __typename?: 'Query' } & {
  organizations: { __typename?: 'OrganizationListOutput' } & {
    items: Array<
      { __typename?: 'Organization' } & Pick<Types.Organization, 'id'> & {
          name: { __typename?: 'SecuredString' } & Pick<
            Types.SecuredString,
            'value'
          >;
        }
    >;
  };
};

export const OrganizationAutocompleteDocument = gql`
  query OrganizationAutocomplete($input: OrganizationListInput!) {
    organizations(input: $input) {
      items {
        id
        name {
          value
        }
      }
    }
  }
`;

/**
 * __useOrganizationAutocompleteQuery__
 *
 * To run a query within a React component, call `useOrganizationAutocompleteQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationAutocompleteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationAutocompleteQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrganizationAutocompleteQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    OrganizationAutocompleteQuery,
    OrganizationAutocompleteQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    OrganizationAutocompleteQuery,
    OrganizationAutocompleteQueryVariables
  >(OrganizationAutocompleteDocument, baseOptions);
}
export function useOrganizationAutocompleteLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    OrganizationAutocompleteQuery,
    OrganizationAutocompleteQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    OrganizationAutocompleteQuery,
    OrganizationAutocompleteQueryVariables
  >(OrganizationAutocompleteDocument, baseOptions);
}
export type OrganizationAutocompleteQueryHookResult = ReturnType<
  typeof useOrganizationAutocompleteQuery
>;
export type OrganizationAutocompleteLazyQueryHookResult = ReturnType<
  typeof useOrganizationAutocompleteLazyQuery
>;
export type OrganizationAutocompleteQueryResult = ApolloReactCommon.QueryResult<
  OrganizationAutocompleteQuery,
  OrganizationAutocompleteQueryVariables
>;
