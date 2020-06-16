/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export interface OrganizationQueryVariables {
  input: Types.Scalars['ID'];
}

export type OrganizationQuery = { __typename?: 'Query' } & {
  organization: { __typename?: 'Organization' } & OrgDetailsFragment;
};

export type OrgDetailsFragment = { __typename?: 'Organization' } & Pick<
  Types.Organization,
  'id' | 'createdAt' | 'avatarLetters'
> & {
    name: { __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value' | 'canEdit'
    >;
  };

export const OrgDetailsFragmentDoc = gql`
  fragment orgDetails on Organization {
    id
    createdAt
    name {
      value
      canEdit
    }
    avatarLetters
  }
`;
export const OrganizationDocument = gql`
  query Organization($input: ID!) {
    organization(id: $input) {
      ...orgDetails
    }
  }
  ${OrgDetailsFragmentDoc}
`;

/**
 * __useOrganizationQuery__
 *
 * To run a query within a React component, call `useOrganizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrganizationQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    OrganizationQuery,
    OrganizationQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    OrganizationQuery,
    OrganizationQueryVariables
  >(OrganizationDocument, baseOptions);
}
export function useOrganizationLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    OrganizationQuery,
    OrganizationQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    OrganizationQuery,
    OrganizationQueryVariables
  >(OrganizationDocument, baseOptions);
}
export type OrganizationQueryHookResult = ReturnType<
  typeof useOrganizationQuery
>;
export type OrganizationLazyQueryHookResult = ReturnType<
  typeof useOrganizationLazyQuery
>;
export type OrganizationQueryResult = ApolloReactCommon.QueryResult<
  OrganizationQuery,
  OrganizationQueryVariables
>;
