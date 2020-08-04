/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as Apollo from '@apollo/client';
import gql from 'graphql-tag';
import type { DisplayLocation_Country_Fragment } from '../../../api/fragments/location.generated';
import { DisplayLocationFragmentDoc } from '../../../api/fragments/location.generated';
import type * as Types from '../../../api/schema.generated';
import type { BudgetOverviewFragment } from '../../../components/BudgetOverviewCard/BudgetOverview.generated';
import { BudgetOverviewFragmentDoc } from '../../../components/BudgetOverviewCard/BudgetOverview.generated';
import type { InternshipEngagementListItemFragment } from '../../../components/InternshipEngagementListItemCard/InternshipEngagementListItem.generated';
import { InternshipEngagementListItemFragmentDoc } from '../../../components/InternshipEngagementListItemCard/InternshipEngagementListItem.generated';
import type { LanguageEngagementListItemFragment } from '../../../components/LanguageEngagementListItemCard/LanguageEngagementListItem.generated';
import { LanguageEngagementListItemFragmentDoc } from '../../../components/LanguageEngagementListItemCard/LanguageEngagementListItem.generated';
import type { PartnershipSummaryFragment } from '../../../components/PartnershipSummary/PartnershipSummary.generated';
import { PartnershipSummaryFragmentDoc } from '../../../components/PartnershipSummary/PartnershipSummary.generated';
import type { ProjectMemberListFragment } from '../../../components/ProjectMembersSummary/ProjectMembersSummary.generated';
import { ProjectMemberListFragmentDoc } from '../../../components/ProjectMembersSummary/ProjectMembersSummary.generated';

export type ProjectOverviewQueryVariables = Types.Exact<{
  input: Types.Scalars['ID'];
}>;

export interface ProjectOverviewQuery {
  readonly project:
    | ({ readonly __typename: 'TranslationProject' } & Pick<
        Types.TranslationProject,
        'id' | 'status' | 'modifiedAt'
      > & {
          readonly deptId: { readonly __typename?: 'SecuredString' } & Pick<
            Types.SecuredString,
            'canRead' | 'canEdit' | 'value'
          >;
          readonly name: { readonly __typename?: 'SecuredString' } & Pick<
            Types.SecuredString,
            'canRead' | 'canEdit' | 'value'
          >;
          readonly location: { readonly __typename?: 'SecuredCountry' } & Pick<
            Types.SecuredCountry,
            'canRead' | 'canEdit'
          > & {
              readonly value?: Types.Maybe<
                {
                  readonly __typename?: 'Country';
                } & DisplayLocation_Country_Fragment
              >;
            };
          readonly mouStart: { readonly __typename?: 'SecuredDate' } & Pick<
            Types.SecuredDate,
            'canRead' | 'canEdit' | 'value'
          >;
          readonly mouEnd: { readonly __typename?: 'SecuredDate' } & Pick<
            Types.SecuredDate,
            'canRead' | 'canEdit' | 'value'
          >;
          readonly budget: { readonly __typename?: 'SecuredBudget' } & Pick<
            Types.SecuredBudget,
            'canRead'
          > & {
              readonly value?: Types.Maybe<
                { readonly __typename?: 'Budget' } & BudgetOverviewFragment
              >;
            };
          readonly team: {
            readonly __typename?: 'SecuredProjectMemberList';
          } & ProjectMemberListFragment;
          readonly partnerships: {
            readonly __typename?: 'SecuredPartnershipList';
          } & PartnershipSummaryFragment;
          readonly engagements: {
            readonly __typename?: 'SecuredEngagementList';
          } & Pick<
            Types.SecuredEngagementList,
            'canRead' | 'canCreate' | 'total'
          > & {
              readonly items: ReadonlyArray<
                | ({
                    readonly __typename: 'LanguageEngagement';
                  } & LanguageEngagementListItemFragment)
                | ({
                    readonly __typename: 'InternshipEngagement';
                  } & InternshipEngagementListItemFragment)
              >;
            };
        })
    | ({ readonly __typename: 'InternshipProject' } & Pick<
        Types.InternshipProject,
        'id' | 'status' | 'modifiedAt'
      > & {
          readonly deptId: { readonly __typename?: 'SecuredString' } & Pick<
            Types.SecuredString,
            'canRead' | 'canEdit' | 'value'
          >;
          readonly name: { readonly __typename?: 'SecuredString' } & Pick<
            Types.SecuredString,
            'canRead' | 'canEdit' | 'value'
          >;
          readonly location: { readonly __typename?: 'SecuredCountry' } & Pick<
            Types.SecuredCountry,
            'canRead' | 'canEdit'
          > & {
              readonly value?: Types.Maybe<
                {
                  readonly __typename?: 'Country';
                } & DisplayLocation_Country_Fragment
              >;
            };
          readonly mouStart: { readonly __typename?: 'SecuredDate' } & Pick<
            Types.SecuredDate,
            'canRead' | 'canEdit' | 'value'
          >;
          readonly mouEnd: { readonly __typename?: 'SecuredDate' } & Pick<
            Types.SecuredDate,
            'canRead' | 'canEdit' | 'value'
          >;
          readonly budget: { readonly __typename?: 'SecuredBudget' } & Pick<
            Types.SecuredBudget,
            'canRead'
          > & {
              readonly value?: Types.Maybe<
                { readonly __typename?: 'Budget' } & BudgetOverviewFragment
              >;
            };
          readonly team: {
            readonly __typename?: 'SecuredProjectMemberList';
          } & ProjectMemberListFragment;
          readonly partnerships: {
            readonly __typename?: 'SecuredPartnershipList';
          } & PartnershipSummaryFragment;
          readonly engagements: {
            readonly __typename?: 'SecuredEngagementList';
          } & Pick<
            Types.SecuredEngagementList,
            'canRead' | 'canCreate' | 'total'
          > & {
              readonly items: ReadonlyArray<
                | ({
                    readonly __typename: 'LanguageEngagement';
                  } & LanguageEngagementListItemFragment)
                | ({
                    readonly __typename: 'InternshipEngagement';
                  } & InternshipEngagementListItemFragment)
              >;
            };
        });
}

export const ProjectOverviewDocument = gql`
  query ProjectOverview($input: ID!) {
    project(id: $input) {
      __typename
      id
      deptId {
        canRead
        canEdit
        value
      }
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
      modifiedAt
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
            __typename
            ...LanguageEngagementListItem
          }
          ... on InternshipEngagement {
            __typename
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
  baseOptions?: Apollo.QueryHookOptions<
    ProjectOverviewQuery,
    ProjectOverviewQueryVariables
  >
) {
  return Apollo.useQuery<ProjectOverviewQuery, ProjectOverviewQueryVariables>(
    ProjectOverviewDocument,
    baseOptions
  );
}
export function useProjectOverviewLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProjectOverviewQuery,
    ProjectOverviewQueryVariables
  >
) {
  return Apollo.useLazyQuery<
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
export type ProjectOverviewQueryResult = Apollo.QueryResult<
  ProjectOverviewQuery,
  ProjectOverviewQueryVariables
>;
