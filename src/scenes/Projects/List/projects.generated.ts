/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as Apollo from '@apollo/client';
import gql from 'graphql-tag';
import type * as Types from '../../../api/schema.generated';
import type {
  ProjectListItem_InternshipProject_Fragment,
  ProjectListItem_TranslationProject_Fragment,
} from '../../../components/ProjectListItemCard/ProjectListItem.generated';
import { ProjectListItemFragmentDoc } from '../../../components/ProjectListItemCard/ProjectListItem.generated';

export type ProjectListQueryVariables = Types.Exact<{
  input: Types.ProjectListInput;
}>;

export interface ProjectListQuery {
  readonly projects: { readonly __typename?: 'ProjectListOutput' } & Pick<
    Types.ProjectListOutput,
    'hasMore' | 'total'
  > & {
      readonly items: ReadonlyArray<
        | ({
            readonly __typename?: 'TranslationProject';
          } & ProjectListItem_TranslationProject_Fragment)
        | ({
            readonly __typename?: 'InternshipProject';
          } & ProjectListItem_InternshipProject_Fragment)
      >;
    };
}

export const ProjectListDocument = gql`
  query ProjectList($input: ProjectListInput!) {
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
 * __useProjectListQuery__
 *
 * To run a query within a React component, call `useProjectListQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectListQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProjectListQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ProjectListQuery,
    ProjectListQueryVariables
  >
) {
  return Apollo.useQuery<ProjectListQuery, ProjectListQueryVariables>(
    ProjectListDocument,
    baseOptions
  );
}
export function useProjectListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProjectListQuery,
    ProjectListQueryVariables
  >
) {
  return Apollo.useLazyQuery<ProjectListQuery, ProjectListQueryVariables>(
    ProjectListDocument,
    baseOptions
  );
}
export type ProjectListQueryHookResult = ReturnType<typeof useProjectListQuery>;
export type ProjectListLazyQueryHookResult = ReturnType<
  typeof useProjectListLazyQuery
>;
export type ProjectListQueryResult = Apollo.QueryResult<
  ProjectListQuery,
  ProjectListQueryVariables
>;
