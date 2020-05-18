/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import {
  ProjectListItem_InternshipProject_Fragment,
  ProjectListItem_TranslationProject_Fragment,
} from '../../../components/ProjectListItemCard/ProjectListItem.generated';
import { ProjectListItemFragmentDoc } from '../../../components/ProjectListItemCard/ProjectListItem.generated';

export interface ProjectsQueryVariables {
  input: Types.ProjectListInput;
}

export type ProjectsQuery = { __typename?: 'Query' } & {
  projects: { __typename?: 'ProjectListOutput' } & Pick<
    Types.ProjectListOutput,
    'hasMore' | 'total'
  > & {
      items: Array<
        | ({
            __typename?: 'InternshipProject';
          } & ProjectListItem_InternshipProject_Fragment)
        | ({
            __typename?: 'TranslationProject';
          } & ProjectListItem_TranslationProject_Fragment)
      >;
    };
};

export const ProjectsDocument = gql`
  query Projects($input: ProjectListInput!) {
    projects(input: $input) {
      items {
        ...ProjectListItem
      }
      hasMore
      total
    }
  }
  ${ProjectListItemFragmentDoc}
`;

/**
 * __useProjectsQuery__
 *
 * To run a query within a React component, call `useProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProjectsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ProjectsQuery,
    ProjectsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<ProjectsQuery, ProjectsQueryVariables>(
    ProjectsDocument,
    baseOptions
  );
}
export function useProjectsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ProjectsQuery,
    ProjectsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<ProjectsQuery, ProjectsQueryVariables>(
    ProjectsDocument,
    baseOptions
  );
}
export type ProjectsQueryHookResult = ReturnType<typeof useProjectsQuery>;
export type ProjectsLazyQueryHookResult = ReturnType<
  typeof useProjectsLazyQuery
>;
export type ProjectsQueryResult = ApolloReactCommon.QueryResult<
  ProjectsQuery,
  ProjectsQueryVariables
>;
