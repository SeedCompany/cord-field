/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import type * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import type * as Types from '../../api/schema.generated';
import type {
  ProjectBreadcrumb_InternshipProject_Fragment,
  ProjectBreadcrumb_TranslationProject_Fragment,
} from '../../components/ProjectBreadcrumb/ProjectBreadcrumb.generated';
import { ProjectBreadcrumbFragmentDoc } from '../../components/ProjectBreadcrumb/ProjectBreadcrumb.generated';
import type { InternshipEngagementDetailFragment } from './InternshipEngagement/InternshipEngagement.generated';
import { InternshipEngagementDetailFragmentDoc } from './InternshipEngagement/InternshipEngagement.generated';
import type { LanguageEngagementDetailFragment } from './LanguageEngagement/LanguageEngagementDetail.generated';
import { LanguageEngagementDetailFragmentDoc } from './LanguageEngagement/LanguageEngagementDetail.generated';

export type EngagementQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  engagementId: Types.Scalars['ID'];
}>;

export interface EngagementQuery {
  readonly project:
    | ({
        readonly __typename?: 'TranslationProject';
      } & ProjectBreadcrumb_TranslationProject_Fragment)
    | ({
        readonly __typename?: 'InternshipProject';
      } & ProjectBreadcrumb_InternshipProject_Fragment);
  readonly engagement:
    | ({ readonly __typename: 'LanguageEngagement' } & Pick<
        Types.LanguageEngagement,
        'id'
      > &
        LanguageEngagementDetailFragment)
    | ({ readonly __typename: 'InternshipEngagement' } & Pick<
        Types.InternshipEngagement,
        'id'
      > &
        InternshipEngagementDetailFragment);
}

export const EngagementDocument = gql`
  query Engagement($projectId: ID!, $engagementId: ID!) {
    project(id: $projectId) {
      ...ProjectBreadcrumb
    }
    engagement(id: $engagementId) {
      id
      __typename
      ... on LanguageEngagement {
        ...LanguageEngagementDetail
      }
      ... on InternshipEngagement {
        ...InternshipEngagementDetail
      }
    }
  }
  ${ProjectBreadcrumbFragmentDoc}
  ${LanguageEngagementDetailFragmentDoc}
  ${InternshipEngagementDetailFragmentDoc}
`;

/**
 * __useEngagementQuery__
 *
 * To run a query within a React component, call `useEngagementQuery` and pass it any options that fit your needs.
 * When your component renders, `useEngagementQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEngagementQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      engagementId: // value for 'engagementId'
 *   },
 * });
 */
export function useEngagementQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    EngagementQuery,
    EngagementQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<EngagementQuery, EngagementQueryVariables>(
    EngagementDocument,
    baseOptions
  );
}
export function useEngagementLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    EngagementQuery,
    EngagementQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    EngagementQuery,
    EngagementQueryVariables
  >(EngagementDocument, baseOptions);
}
export type EngagementQueryHookResult = ReturnType<typeof useEngagementQuery>;
export type EngagementLazyQueryHookResult = ReturnType<
  typeof useEngagementLazyQuery
>;
export type EngagementQueryResult = ApolloReactCommon.QueryResult<
  EngagementQuery,
  EngagementQueryVariables
>;
