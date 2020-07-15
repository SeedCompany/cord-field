/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import {
  FileVersionItem_Directory_Fragment,
  FileVersionItem_File_Fragment,
  FileVersionItem_FileVersion_Fragment,
} from '../../../components/files/FileVersionItem/FileVersionItem.generated';
import { FileVersionItemFragmentDoc } from '../../../components/files/FileVersionItem/FileVersionItem.generated';
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

export type FileNodeInfo_Directory_Fragment = {
  __typename?: 'Directory';
} & Pick<Types.Directory, 'category' | 'id' | 'name' | 'type' | 'createdAt'> & {
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
  };

export type FileNodeInfo_File_Fragment = { __typename?: 'File' } & Pick<
  Types.File,
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
  };

export type FileNodeInfo_FileVersion_Fragment = {
  __typename?: 'FileVersion';
} & Pick<
  Types.FileVersion,
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
  };

export type FileNodeInfoFragment =
  | FileNodeInfo_Directory_Fragment
  | FileNodeInfo_File_Fragment
  | FileNodeInfo_FileVersion_Fragment;

export interface ProjectDirectoryQueryVariables {
  id: Types.Scalars['ID'];
}

export type ProjectDirectoryQuery = { __typename?: 'Query' } & {
  directory: { __typename?: 'Directory' } & {
    children: { __typename?: 'FileListOutput' } & Pick<
      Types.FileListOutput,
      'total'
    > & {
        items: Array<
          | ({ __typename?: 'Directory' } & FileNodeInfo_Directory_Fragment &
              FileNodeInfo_Directory_Fragment)
          | ({ __typename?: 'File' } & Pick<
              Types.File,
              'size' | 'downloadUrl' | 'mimeType'
            > &
              FileNodeInfo_File_Fragment &
              FileNodeInfo_File_Fragment)
          | ({ __typename?: 'FileVersion' } & Pick<
              Types.FileVersion,
              'size' | 'downloadUrl'
            > &
              FileNodeInfo_FileVersion_Fragment &
              FileNodeInfo_FileVersion_Fragment)
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
  } & FileNodeInfo_Directory_Fragment;
};

export interface ProjectFileVersionsQueryVariables {
  id: Types.Scalars['ID'];
}

export type ProjectFileVersionsQuery = { __typename?: 'Query' } & {
  file: { __typename?: 'File' } & Pick<Types.File, 'id'> & {
      children: { __typename?: 'FileListOutput' } & {
        items: Array<
          | ({ __typename?: 'Directory' } & FileVersionItem_Directory_Fragment)
          | ({ __typename?: 'File' } & FileVersionItem_File_Fragment)
          | ({
              __typename?: 'FileVersion';
            } & FileVersionItem_FileVersion_Fragment)
        >;
      };
    };
};

export const FileNodeInfoFragmentDoc = gql`
  fragment FileNodeInfo on FileNode {
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
  }
`;
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
      ...FileNodeInfo
      children {
        total
        items {
          ...FileNodeInfo
          ... on Directory {
            ...FileNodeInfo
          }
          ... on File {
            ...FileNodeInfo
            size
            downloadUrl
            mimeType
          }
          ... on FileVersion {
            ...FileNodeInfo
            size
            downloadUrl
          }
        }
      }
      parents {
        id
        name
      }
    }
  }
  ${FileNodeInfoFragmentDoc}
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
export const ProjectFileVersionsDocument = gql`
  query ProjectFileVersions($id: ID!) {
    file(id: $id) {
      id
      children {
        items {
          ...FileVersionItem
        }
      }
    }
  }
  ${FileVersionItemFragmentDoc}
`;

/**
 * __useProjectFileVersionsQuery__
 *
 * To run a query within a React component, call `useProjectFileVersionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectFileVersionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectFileVersionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProjectFileVersionsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ProjectFileVersionsQuery,
    ProjectFileVersionsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ProjectFileVersionsQuery,
    ProjectFileVersionsQueryVariables
  >(ProjectFileVersionsDocument, baseOptions);
}
export function useProjectFileVersionsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ProjectFileVersionsQuery,
    ProjectFileVersionsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ProjectFileVersionsQuery,
    ProjectFileVersionsQueryVariables
  >(ProjectFileVersionsDocument, baseOptions);
}
export type ProjectFileVersionsQueryHookResult = ReturnType<
  typeof useProjectFileVersionsQuery
>;
export type ProjectFileVersionsLazyQueryHookResult = ReturnType<
  typeof useProjectFileVersionsLazyQuery
>;
export type ProjectFileVersionsQueryResult = ApolloReactCommon.QueryResult<
  ProjectFileVersionsQuery,
  ProjectFileVersionsQueryVariables
>;
