/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import type * as Types from '../../api/schema.generated';
import type { ProjectMemberItemFragment } from './ProjectMemberItem.generated';
import { ProjectMemberItemFragmentDoc } from './ProjectMemberItem.generated';

export type ProjectMemberListFragment = {
  readonly __typename?: 'SecuredProjectMemberList';
} & Pick<Types.SecuredProjectMemberList, 'total'> & {
    readonly items: ReadonlyArray<
      { readonly __typename?: 'ProjectMember' } & ProjectMemberItemFragment
    >;
  };

export const ProjectMemberListFragmentDoc = gql`
  fragment ProjectMemberList on SecuredProjectMemberList {
    total
    items {
      ...ProjectMemberItem
    }
  }
  ${ProjectMemberItemFragmentDoc}
`;
