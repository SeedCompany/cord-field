/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';
import { InternshipEngagementDetailFragment } from './InternshipEngagement/InternshipEngagement.generated';
import { InternshipEngagementDetailFragmentDoc } from './InternshipEngagement/InternshipEngagement.generated';
import {
  LanguageEngagementDetailFragment,
  ProjectBreadcrumb_InternshipProject_Fragment,
  ProjectBreadcrumb_TranslationProject_Fragment,
} from './LanguageEngagement/LanguageEngagementDetail.generated';
import {
  LanguageEngagementDetailFragmentDoc,
  ProjectBreadcrumbFragmentDoc,
} from './LanguageEngagement/LanguageEngagementDetail.generated';

export interface EngagementQueryVariables {
  input: Types.Scalars['ID'];
}

export type EngagementQuery = { __typename?: 'Query' } & {
  engagement:
    | ({ __typename: 'InternshipEngagement' } & Pick<
        Types.InternshipEngagement,
        'id'
      > &
        InternshipEngagementDetailFragment)
    | ({ __typename: 'LanguageEngagement' } & Pick<
        Types.LanguageEngagement,
        'id'
      > &
        LanguageEngagementDetailFragment);
};

export interface ProjectBreadcrumbQueryVariables {
  input: Types.Scalars['ID'];
}

export type ProjectBreadcrumbQuery = { __typename?: 'Query' } & {
  project:
    | ({
        __typename?: 'InternshipProject';
      } & ProjectBreadcrumb_InternshipProject_Fragment)
    | ({
        __typename?: 'TranslationProject';
      } & ProjectBreadcrumb_TranslationProject_Fragment);
};

export const EngagementDocument = gql`
  query Engagement($input: ID!) {
    engagement(id: $input) {
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
 *      input: // value for 'input'
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
export const ProjectBreadcrumbDocument = gql`
  query ProjectBreadcrumb($input: ID!) {
    project(id: $input) {
      ...ProjectBreadcrumb
    }
  }
  ${ProjectBreadcrumbFragmentDoc}
`;

/**
 * __useProjectBreadcrumbQuery__
 *
 * To run a query within a React component, call `useProjectBreadcrumbQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectBreadcrumbQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectBreadcrumbQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProjectBreadcrumbQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ProjectBreadcrumbQuery,
    ProjectBreadcrumbQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ProjectBreadcrumbQuery,
    ProjectBreadcrumbQueryVariables
  >(ProjectBreadcrumbDocument, baseOptions);
}
export function useProjectBreadcrumbLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ProjectBreadcrumbQuery,
    ProjectBreadcrumbQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ProjectBreadcrumbQuery,
    ProjectBreadcrumbQueryVariables
  >(ProjectBreadcrumbDocument, baseOptions);
}
export type ProjectBreadcrumbQueryHookResult = ReturnType<
  typeof useProjectBreadcrumbQuery
>;
export type ProjectBreadcrumbLazyQueryHookResult = ReturnType<
  typeof useProjectBreadcrumbLazyQuery
>;
export type ProjectBreadcrumbQueryResult = ApolloReactCommon.QueryResult<
  ProjectBreadcrumbQuery,
  ProjectBreadcrumbQueryVariables
>;
