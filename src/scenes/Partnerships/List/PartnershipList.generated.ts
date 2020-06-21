/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import { PartnershipCardFragment } from '../../../components/PartnershipCard/PartnershipCard.generated';
import { PartnershipCardFragmentDoc } from '../../../components/PartnershipCard/PartnershipCard.generated';

export interface ProjectPartnershipsQueryVariables {
  input: Types.Scalars['ID'];
}

export type ProjectPartnershipsQuery = { __typename?: 'Query' } & {
  project:
    | ({ __typename?: 'InternshipProject' } & Pick<
        Types.InternshipProject,
        'id'
      > & {
          name: { __typename?: 'SecuredString' } & Pick<
            Types.SecuredString,
            'value'
          >;
          partnerships: { __typename?: 'SecuredPartnershipList' } & Pick<
            Types.SecuredPartnershipList,
            'canCreate' | 'total'
          > & {
              items: Array<
                { __typename?: 'Partnership' } & PartnershipCardFragment
              >;
            };
        })
    | ({ __typename?: 'TranslationProject' } & Pick<
        Types.TranslationProject,
        'id'
      > & {
          name: { __typename?: 'SecuredString' } & Pick<
            Types.SecuredString,
            'value'
          >;
          partnerships: { __typename?: 'SecuredPartnershipList' } & Pick<
            Types.SecuredPartnershipList,
            'canCreate' | 'total'
          > & {
              items: Array<
                { __typename?: 'Partnership' } & PartnershipCardFragment
              >;
            };
        });
};

export const ProjectPartnershipsDocument = gql`
  query ProjectPartnerships($input: ID!) {
    project(id: $input) {
      id
      name {
        value
      }
      partnerships {
        canCreate
        total
        items {
          ...PartnershipCard
        }
      }
    }
  }
  ${PartnershipCardFragmentDoc}
`;

/**
 * __useProjectPartnershipsQuery__
 *
 * To run a query within a React component, call `useProjectPartnershipsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectPartnershipsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectPartnershipsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProjectPartnershipsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ProjectPartnershipsQuery,
    ProjectPartnershipsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ProjectPartnershipsQuery,
    ProjectPartnershipsQueryVariables
  >(ProjectPartnershipsDocument, baseOptions);
}
export function useProjectPartnershipsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ProjectPartnershipsQuery,
    ProjectPartnershipsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ProjectPartnershipsQuery,
    ProjectPartnershipsQueryVariables
  >(ProjectPartnershipsDocument, baseOptions);
}
export type ProjectPartnershipsQueryHookResult = ReturnType<
  typeof useProjectPartnershipsQuery
>;
export type ProjectPartnershipsLazyQueryHookResult = ReturnType<
  typeof useProjectPartnershipsLazyQuery
>;
export type ProjectPartnershipsQueryResult = ApolloReactCommon.QueryResult<
  ProjectPartnershipsQuery,
  ProjectPartnershipsQueryVariables
>;
