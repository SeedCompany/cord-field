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

export interface ProjectRootDirectoryQueryVariables {
  id: Types.Scalars['ID'];
}

export type ProjectRootDirectoryQuery = { __typename?: 'Query' } & {
  project:
    | ({ __typename?: 'InternshipProject' } & {
        rootDirectory: { __typename?: 'Directory' } & Pick<
          Types.Directory,
          'id'
        >;
      } & ProjectBreadcrumb_InternshipProject_Fragment)
    | ({ __typename?: 'TranslationProject' } & {
        rootDirectory: { __typename?: 'Directory' } & Pick<
          Types.Directory,
          'id'
        >;
      } & ProjectBreadcrumb_TranslationProject_Fragment);
};

export interface ProjectDirectoryQueryVariables {
  id: Types.Scalars['ID'];
}

export type ProjectDirectoryQuery = { __typename?: 'Query' } & {
  directory: { __typename?: 'Directory' } & Pick<
    Types.Directory,
    'category' | 'id' | 'name' | 'type' | 'createdAt'
  > & {
      createdBy: { __typename?: 'User' } & {
        displayFirstName: { __typename?: 'SecuredString' } & Pick<
          Types.SecuredString,
          'value'
        >;
        displayLastName: { __typename?: 'SecuredString' } & Pick<
          Types.SecuredString,
          'value'
        >;
      };
      children: { __typename?: 'FileListOutput' } & Pick<
        Types.FileListOutput,
        'total'
      > & {
          items: Array<
            | ({ __typename?: 'Directory' } & Pick<
                Types.Directory,
                'name' | 'category' | 'createdAt' | 'type' | 'id'
              > & {
                  createdBy: { __typename?: 'User' } & {
                    displayFirstName: { __typename?: 'SecuredString' } & Pick<
                      Types.SecuredString,
                      'value'
                    >;
                    displayLastName: { __typename?: 'SecuredString' } & Pick<
                      Types.SecuredString,
                      'value'
                    >;
                  };
                })
            | ({ __typename?: 'File' } & Pick<
                Types.File,
                | 'id'
                | 'size'
                | 'name'
                | 'type'
                | 'downloadUrl'
                | 'category'
                | 'createdAt'
                | 'mimeType'
              > & {
                  createdBy: { __typename?: 'User' } & {
                    displayFirstName: { __typename?: 'SecuredString' } & Pick<
                      Types.SecuredString,
                      'value'
                    >;
                    displayLastName: { __typename?: 'SecuredString' } & Pick<
                      Types.SecuredString,
                      'value'
                    >;
                  };
                })
            | ({ __typename?: 'FileVersion' } & Pick<
                Types.FileVersion,
                | 'id'
                | 'name'
                | 'size'
                | 'type'
                | 'downloadUrl'
                | 'category'
                | 'createdAt'
              > & {
                  createdBy: { __typename?: 'User' } & {
                    displayFirstName: { __typename?: 'SecuredString' } & Pick<
                      Types.SecuredString,
                      'value'
                    >;
                    displayLastName: { __typename?: 'SecuredString' } & Pick<
                      Types.SecuredString,
                      'value'
                    >;
                  };
                })
          >;
        };
      parents: Array<
        | ({ __typename?: 'Directory' } & Pick<Types.Directory, 'id' | 'name'>)
        | ({ __typename?: 'File' } & Pick<Types.File, 'id' | 'name'>)
        | ({ __typename?: 'FileVersion' } & Pick<
            Types.FileVersion,
            'id' | 'name'
          >)
      >;
    };
};

export const ProjectRootDirectoryDocument = gql`
  query ProjectRootDirectory($id: ID!) {
    project(id: $id) {
      ...ProjectBreadcrumb
      rootDirectory {
        id
      }
    }
  }
  ${ProjectBreadcrumbFragmentDoc}
`;

/**
 * __useProjectRootDirectoryQuery__
 *
 * To run a query within a React component, call `useProjectRootDirectoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectRootDirectoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectRootDirectoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProjectRootDirectoryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ProjectRootDirectoryQuery,
    ProjectRootDirectoryQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ProjectRootDirectoryQuery,
    ProjectRootDirectoryQueryVariables
  >(ProjectRootDirectoryDocument, baseOptions);
}
export function useProjectRootDirectoryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ProjectRootDirectoryQuery,
    ProjectRootDirectoryQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ProjectRootDirectoryQuery,
    ProjectRootDirectoryQueryVariables
  >(ProjectRootDirectoryDocument, baseOptions);
}
export type ProjectRootDirectoryQueryHookResult = ReturnType<
  typeof useProjectRootDirectoryQuery
>;
export type ProjectRootDirectoryLazyQueryHookResult = ReturnType<
  typeof useProjectRootDirectoryLazyQuery
>;
export type ProjectRootDirectoryQueryResult = ApolloReactCommon.QueryResult<
  ProjectRootDirectoryQuery,
  ProjectRootDirectoryQueryVariables
>;
export const ProjectDirectoryDocument = gql`
  query ProjectDirectory($id: ID!) {
    directory(id: $id) {
      category
      id
      name
      type
      createdAt
      createdBy {
        displayFirstName {
          value
        }
        displayLastName {
          value
        }
      }
      children {
        total
        items {
          category
          createdAt
          createdBy {
            displayFirstName {
              value
            }
            displayLastName {
              value
            }
          }
          id
          name
          type
          ... on Directory {
            name
            category
            createdAt
            createdBy {
              displayFirstName {
                value
              }
              displayLastName {
                value
              }
            }
            type
            id
          }
          ... on File {
            id
            size
            name
            type
            downloadUrl
            category
            createdAt
            createdBy {
              displayFirstName {
                value
              }
              displayLastName {
                value
              }
            }
            mimeType
          }
          ... on FileVersion {
            id
            name
            size
            type
            downloadUrl
            category
            createdAt
            createdBy {
              displayFirstName {
                value
              }
              displayLastName {
                value
              }
            }
          }
        }
      }
      parents {
        id
        name
      }
    }
  }
`;

/**
 * __useProjectDirectoryQuery__
 *
 * To run a query within a React component, call `useProjectDirectoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectDirectoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectDirectoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProjectDirectoryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ProjectDirectoryQuery,
    ProjectDirectoryQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ProjectDirectoryQuery,
    ProjectDirectoryQueryVariables
  >(ProjectDirectoryDocument, baseOptions);
}
export function useProjectDirectoryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ProjectDirectoryQuery,
    ProjectDirectoryQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ProjectDirectoryQuery,
    ProjectDirectoryQueryVariables
  >(ProjectDirectoryDocument, baseOptions);
}
export type ProjectDirectoryQueryHookResult = ReturnType<
  typeof useProjectDirectoryQuery
>;
export type ProjectDirectoryLazyQueryHookResult = ReturnType<
  typeof useProjectDirectoryLazyQuery
>;
export type ProjectDirectoryQueryResult = ApolloReactCommon.QueryResult<
  ProjectDirectoryQuery,
  ProjectDirectoryQueryVariables
>;
