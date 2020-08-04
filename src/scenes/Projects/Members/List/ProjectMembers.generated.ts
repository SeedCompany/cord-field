/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import type * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import type * as Types from '../../../../api/schema.generated';
import type {
  ProjectBreadcrumb_InternshipProject_Fragment,
  ProjectBreadcrumb_TranslationProject_Fragment,
} from '../../../../components/ProjectBreadcrumb/ProjectBreadcrumb.generated';
import { ProjectBreadcrumbFragmentDoc } from '../../../../components/ProjectBreadcrumb/ProjectBreadcrumb.generated';
import type { ProjectMemberCardFragment } from '../../../../components/ProjectMemberCard/ProjectMember.generated';
import { ProjectMemberCardFragmentDoc } from '../../../../components/ProjectMemberCard/ProjectMember.generated';

export type ProjectMembersQueryVariables = Types.Exact<{
  input: Types.Scalars['ID'];
}>;

export interface ProjectMembersQuery {
  readonly project:
    | ({ readonly __typename?: 'TranslationProject' } & {
        readonly team: {
          readonly __typename?: 'SecuredProjectMemberList';
        } & Pick<Types.SecuredProjectMemberList, 'canRead' | 'canCreate'> & {
            readonly items: ReadonlyArray<
              {
                readonly __typename?: 'ProjectMember';
              } & ProjectMemberCardFragment
            >;
          };
      } & ProjectBreadcrumb_TranslationProject_Fragment)
    | ({ readonly __typename?: 'InternshipProject' } & {
        readonly team: {
          readonly __typename?: 'SecuredProjectMemberList';
        } & Pick<Types.SecuredProjectMemberList, 'canRead' | 'canCreate'> & {
            readonly items: ReadonlyArray<
              {
                readonly __typename?: 'ProjectMember';
              } & ProjectMemberCardFragment
            >;
          };
      } & ProjectBreadcrumb_InternshipProject_Fragment);
}

export const ProjectMembersDocument = gql`
  query ProjectMembers($input: ID!) {
    project(id: $input) {
      ...ProjectBreadcrumb
      team {
        items {
          ...ProjectMemberCard
        }
        canRead
        canCreate
      }
    }
  }
  ${ProjectBreadcrumbFragmentDoc}
  ${ProjectMemberCardFragmentDoc}
`;

/**
 * __useProjectMembersQuery__
 *
 * To run a query within a React component, call `useProjectMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectMembersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProjectMembersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ProjectMembersQuery,
    ProjectMembersQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ProjectMembersQuery,
    ProjectMembersQueryVariables
  >(ProjectMembersDocument, baseOptions);
}
export function useProjectMembersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ProjectMembersQuery,
    ProjectMembersQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ProjectMembersQuery,
    ProjectMembersQueryVariables
  >(ProjectMembersDocument, baseOptions);
}
export type ProjectMembersQueryHookResult = ReturnType<
  typeof useProjectMembersQuery
>;
export type ProjectMembersLazyQueryHookResult = ReturnType<
  typeof useProjectMembersLazyQuery
>;
export type ProjectMembersQueryResult = ApolloReactCommon.QueryResult<
  ProjectMembersQuery,
  ProjectMembersQueryVariables
>;
