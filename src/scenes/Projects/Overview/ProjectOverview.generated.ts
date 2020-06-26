/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import { DisplayLocation_Country_Fragment } from '../../../api/fragments/location.generated';
import { DisplayLocationFragmentDoc } from '../../../api/fragments/location.generated';
import * as Types from '../../../api/schema.generated';
import { BudgetOverviewFragment } from '../../../components/BudgetOverviewCard/BudgetOverview.generated';
import { BudgetOverviewFragmentDoc } from '../../../components/BudgetOverviewCard/BudgetOverview.generated';
import { InternshipEngagementListItemFragment } from '../../../components/InternshipEngagementListItemCard/InternshipEngagementListItem.generated';
import { InternshipEngagementListItemFragmentDoc } from '../../../components/InternshipEngagementListItemCard/InternshipEngagementListItem.generated';
import { LanguageEngagementListItemFragment } from '../../../components/LanguageEngagementListItemCard/LanguageEngagementListItem.generated';
import { LanguageEngagementListItemFragmentDoc } from '../../../components/LanguageEngagementListItemCard/LanguageEngagementListItem.generated';
import { PartnershipSummaryFragment } from '../../../components/PartnershipSummary/PartnershipSummary.generated';
import { ProjectMemberListFragment } from '../../../components/ProjectMembersSummary/ProjectMembersSummary.generated';
import { ProjectMemberListFragmentDoc } from '../../../components/ProjectMembersSummary/ProjectMembersSummary.generated';
import { PartnershipSummaryFragmentDoc } from '../../../components/PartnershipSummary/PartnershipSummary.generated';

export interface ProjectOverviewQueryVariables {
  input: Types.Scalars['ID'];
}

export type ProjectOverviewQuery = { __typename?: 'Query' } & {
  project:
    | ({ __typename?: 'InternshipProject' } & Pick<
        Types.InternshipProject,
        'id' | 'status'
      > & {
          name: { __typename?: 'SecuredString' } & Pick<
            Types.SecuredString,
            'canRead' | 'canEdit' | 'value'
          >;
          location: { __typename?: 'SecuredCountry' } & Pick<
            Types.SecuredCountry,
            'canRead' | 'canEdit'
          > & {
              value?: Types.Maybe<
                { __typename?: 'Country' } & DisplayLocation_Country_Fragment
              >;
            };
          mouStart: { __typename?: 'SecuredDate' } & Pick<
            Types.SecuredDate,
            'canRead' | 'canEdit' | 'value'
          >;
          mouEnd: { __typename?: 'SecuredDate' } & Pick<
            Types.SecuredDate,
            'canRead' | 'canEdit' | 'value'
          >;
          budget: { __typename?: 'SecuredBudget' } & Pick<
            Types.SecuredBudget,
            'canRead'
          > & {
              value?: Types.Maybe<
                { __typename?: 'Budget' } & BudgetOverviewFragment
              >;
            };
          team: {
            __typename?: 'SecuredProjectMemberList';
          } & ProjectMemberListFragment;
          partnerships: {
            __typename?: 'SecuredPartnershipList';
          } & PartnershipSummaryFragment;
          engagements: { __typename?: 'SecuredEngagementList' } & Pick<
            Types.SecuredEngagementList,
            'canRead' | 'canCreate' | 'total'
          > & {
              items: Array<
                | ({
                    __typename?: 'InternshipEngagement';
                  } & InternshipEngagementListItemFragment)
                | ({
                    __typename?: 'LanguageEngagement';
                  } & LanguageEngagementListItemFragment)
              >;
            };
        })
    | ({ __typename?: 'TranslationProject' } & Pick<
        Types.TranslationProject,
        'id' | 'status'
      > & {
          name: { __typename?: 'SecuredString' } & Pick<
            Types.SecuredString,
            'canRead' | 'canEdit' | 'value'
          >;
          location: { __typename?: 'SecuredCountry' } & Pick<
            Types.SecuredCountry,
            'canRead' | 'canEdit'
          > & {
              value?: Types.Maybe<
                { __typename?: 'Country' } & DisplayLocation_Country_Fragment
              >;
            };
          mouStart: { __typename?: 'SecuredDate' } & Pick<
            Types.SecuredDate,
            'canRead' | 'canEdit' | 'value'
          >;
          mouEnd: { __typename?: 'SecuredDate' } & Pick<
            Types.SecuredDate,
            'canRead' | 'canEdit' | 'value'
          >;
          budget: { __typename?: 'SecuredBudget' } & Pick<
            Types.SecuredBudget,
            'canRead'
          > & {
              value?: Types.Maybe<
                { __typename?: 'Budget' } & BudgetOverviewFragment
              >;
            };
          team: {
            __typename?: 'SecuredProjectMemberList';
          } & ProjectMemberListFragment;
          partnerships: {
            __typename?: 'SecuredPartnershipList';
          } & PartnershipSummaryFragment;
          engagements: { __typename?: 'SecuredEngagementList' } & Pick<
            Types.SecuredEngagementList,
            'canRead' | 'canCreate' | 'total'
          > & {
              items: Array<
                | ({
                    __typename?: 'InternshipEngagement';
                  } & InternshipEngagementListItemFragment)
                | ({
                    __typename?: 'LanguageEngagement';
                  } & LanguageEngagementListItemFragment)
              >;
            };
        });
};

export const ProjectOverviewDocument = gql`
  query ProjectOverview($input: ID!) {
    project(id: $input) {
      id
      name {
        canRead
        canEdit
        value
      }
      location {
        canRead
        canEdit
        value {
          ...DisplayLocation
        }
      }
      mouStart {
        canRead
        canEdit
        value
      }
      mouEnd {
        canRead
        canEdit
        value
      }
      status
      budget {
        canRead
        value {
          ...BudgetOverview
        }
      }
      team {
        ...ProjectMemberList
      }
      partnerships {
        ...PartnershipSummary
      }
      engagements {
        canRead
        canCreate
        total
        items {
          ... on LanguageEngagement {
            ...LanguageEngagementListItem
          }
          ... on InternshipEngagement {
            ...InternshipEngagementListItem
          }
        }
      }
    }
  }
  ${DisplayLocationFragmentDoc}
  ${BudgetOverviewFragmentDoc}
  ${ProjectMemberListFragmentDoc}
  ${PartnershipSummaryFragmentDoc}
  ${LanguageEngagementListItemFragmentDoc}
  ${InternshipEngagementListItemFragmentDoc}
`;

/**
 * __useProjectOverviewQuery__
 *
 * To run a query within a React component, call `useProjectOverviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectOverviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectOverviewQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProjectOverviewQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ProjectOverviewQuery,
    ProjectOverviewQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ProjectOverviewQuery,
    ProjectOverviewQueryVariables
  >(ProjectOverviewDocument, baseOptions);
}
export function useProjectOverviewLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ProjectOverviewQuery,
    ProjectOverviewQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ProjectOverviewQuery,
    ProjectOverviewQueryVariables
  >(ProjectOverviewDocument, baseOptions);
}
export type ProjectOverviewQueryHookResult = ReturnType<
  typeof useProjectOverviewQuery
>;
export type ProjectOverviewLazyQueryHookResult = ReturnType<
  typeof useProjectOverviewLazyQuery
>;
export type ProjectOverviewQueryResult = ApolloReactCommon.QueryResult<
  ProjectOverviewQuery,
  ProjectOverviewQueryVariables
>;
