/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import {
  ProjectBreadcrumb_InternshipProject_Fragment,
  ProjectBreadcrumb_TranslationProject_Fragment,
} from '../../../components/ProjectBreadcrumb/ProjectBreadcrumb.generated';
import { ProjectBreadcrumbFragmentDoc } from '../../../components/ProjectBreadcrumb/ProjectBreadcrumb.generated';

export interface ProjectFilesQueryVariables {
  input: Types.Scalars['ID'];
}

export type ProjectFilesQuery = { __typename?: 'Query' } & {
  project:
    | ({ __typename?: 'InternshipProject' } & {
        rootDirectory: { __typename?: 'Directory' } & Pick<
          Types.Directory,
          'id' | 'name'
        > & {
            children: { __typename?: 'FileListOutput' } & {
              items: Array<
                | ({ __typename?: 'Directory' } & Pick<
                    Types.Directory,
                    'id' | 'createdAt' | 'type' | 'category' | 'name'
                  > & {
                      createdBy: { __typename?: 'User' } & Pick<
                        Types.User,
                        'fullName'
                      >;
                    })
                | ({ __typename?: 'File' } & Pick<
                    Types.File,
                    'id' | 'createdAt' | 'type' | 'category' | 'name'
                  > & {
                      createdBy: { __typename?: 'User' } & Pick<
                        Types.User,
                        'fullName'
                      >;
                    })
                | ({ __typename?: 'FileVersion' } & Pick<
                    Types.FileVersion,
                    'id' | 'createdAt' | 'type' | 'category' | 'name'
                  > & {
                      createdBy: { __typename?: 'User' } & Pick<
                        Types.User,
                        'fullName'
                      >;
                    })
              >;
            };
          };
      } & ProjectBreadcrumb_InternshipProject_Fragment)
    | ({ __typename?: 'TranslationProject' } & {
        rootDirectory: { __typename?: 'Directory' } & Pick<
          Types.Directory,
          'id' | 'name'
        > & {
            children: { __typename?: 'FileListOutput' } & {
              items: Array<
                | ({ __typename?: 'Directory' } & Pick<
                    Types.Directory,
                    'id' | 'createdAt' | 'type' | 'category' | 'name'
                  > & {
                      createdBy: { __typename?: 'User' } & Pick<
                        Types.User,
                        'fullName'
                      >;
                    })
                | ({ __typename?: 'File' } & Pick<
                    Types.File,
                    'id' | 'createdAt' | 'type' | 'category' | 'name'
                  > & {
                      createdBy: { __typename?: 'User' } & Pick<
                        Types.User,
                        'fullName'
                      >;
                    })
                | ({ __typename?: 'FileVersion' } & Pick<
                    Types.FileVersion,
                    'id' | 'createdAt' | 'type' | 'category' | 'name'
                  > & {
                      createdBy: { __typename?: 'User' } & Pick<
                        Types.User,
                        'fullName'
                      >;
                    })
              >;
            };
          };
      } & ProjectBreadcrumb_TranslationProject_Fragment);
};

export const ProjectFilesDocument = gql`
  query ProjectFiles($input: ID!) {
    project(id: $input) {
      ...ProjectBreadcrumb
      rootDirectory {
        id
        name
        children {
          items {
            id
            createdAt
            type
            category
            name
            createdBy {
              fullName
            }
          }
        }
      }
    }
  }
  ${ProjectBreadcrumbFragmentDoc}
`;

/**
 * __useProjectFilesQuery__
 *
 * To run a query within a React component, call `useProjectFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectFilesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProjectFilesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ProjectFilesQuery,
    ProjectFilesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ProjectFilesQuery,
    ProjectFilesQueryVariables
  >(ProjectFilesDocument, baseOptions);
}
export function useProjectFilesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ProjectFilesQuery,
    ProjectFilesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ProjectFilesQuery,
    ProjectFilesQueryVariables
  >(ProjectFilesDocument, baseOptions);
}
export type ProjectFilesQueryHookResult = ReturnType<
  typeof useProjectFilesQuery
>;
export type ProjectFilesLazyQueryHookResult = ReturnType<
  typeof useProjectFilesLazyQuery
>;
export type ProjectFilesQueryResult = ApolloReactCommon.QueryResult<
  ProjectFilesQuery,
  ProjectFilesQueryVariables
>;
