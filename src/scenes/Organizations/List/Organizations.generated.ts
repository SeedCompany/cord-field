/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as Apollo from '@apollo/client';
import gql from 'graphql-tag';
import type * as Types from '../../../api/schema.generated';
import type { OrganizationListItemFragment } from '../../../components/OrganizationListItemCard/OrganizationListItem.generated';
import { OrganizationListItemFragmentDoc } from '../../../components/OrganizationListItemCard/OrganizationListItem.generated';

export type OrganizationsQueryVariables = Types.Exact<{
  input: Types.OrganizationListInput;
}>;

export interface OrganizationsQuery {
  readonly organizations: {
    readonly __typename?: 'OrganizationListOutput';
  } & Pick<Types.OrganizationListOutput, 'hasMore' | 'total'> & {
      readonly items: ReadonlyArray<
        { readonly __typename?: 'Organization' } & OrganizationListItemFragment
      >;
    };
}

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
  baseOptions?: Apollo.QueryHookOptions<
    OrganizationsQuery,
    OrganizationsQueryVariables
  >
) {
  return Apollo.useQuery<OrganizationsQuery, OrganizationsQueryVariables>(
    OrganizationsDocument,
    baseOptions
  );
}
export function useOrganizationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OrganizationsQuery,
    OrganizationsQueryVariables
  >
) {
  return Apollo.useLazyQuery<OrganizationsQuery, OrganizationsQueryVariables>(
    OrganizationsDocument,
    baseOptions
  );
}
export type OrganizationsQueryHookResult = ReturnType<
  typeof useOrganizationsQuery
>;
export type OrganizationsLazyQueryHookResult = ReturnType<
  typeof useOrganizationsLazyQuery
>;
export type OrganizationsQueryResult = Apollo.QueryResult<
  OrganizationsQuery,
  OrganizationsQueryVariables
>;
