/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import { OrganizationListItemFragment } from '../../../components/OrganizationListItemCard/OrganizationListItem.generated';
import { OrganizationListItemFragmentDoc } from '../../../components/OrganizationListItemCard/OrganizationListItem.generated';

export type OrganizationsQueryVariables = Types.Exact<{
  input: Types.OrganizationListInput;
}>;

export type OrganizationsQuery = { __typename?: 'Query' } & {
  organizations: { __typename?: 'OrganizationListOutput' } & Pick<
    Types.OrganizationListOutput,
    'hasMore' | 'total'
  > & {
      items: Array<
        { __typename?: 'Organization' } & OrganizationListItemFragment
      >;
    };
};

export const OrganizationsDocument = gql`
  query Organizations($input: OrganizationListInput!) {
    organizations(input: $input) {
      items {
        ...OrganizationListItem
      }
      hasMore
      total
    }
  }
  ${OrganizationListItemFragmentDoc}
`;

/**
 * __useOrganizationsQuery__
 *
 * To run a query within a React component, call `useOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrganizationsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    OrganizationsQuery,
    OrganizationsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    OrganizationsQuery,
    OrganizationsQueryVariables
  >(OrganizationsDocument, baseOptions);
}
export function useOrganizationsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    OrganizationsQuery,
    OrganizationsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    OrganizationsQuery,
    OrganizationsQueryVariables
  >(OrganizationsDocument, baseOptions);
}
export type OrganizationsQueryHookResult = ReturnType<
  typeof useOrganizationsQuery
>;
export type OrganizationsLazyQueryHookResult = ReturnType<
  typeof useOrganizationsLazyQuery
>;
export type OrganizationsQueryResult = ApolloReactCommon.QueryResult<
  OrganizationsQuery,
  OrganizationsQueryVariables
>;
