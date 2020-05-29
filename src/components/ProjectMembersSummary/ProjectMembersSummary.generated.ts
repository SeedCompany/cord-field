/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type ProjectMemberListFragment = {
  __typename?: 'ProjectMemberListOutput';
} & {
  items: Array<
    { __typename?: 'ProjectMember' } & {
      user: { __typename?: 'SecuredUser' } & {
        value?: Types.Maybe<
          { __typename?: 'User' } & Pick<
            Types.User,
            'id' | 'avatarLetters' | 'firstName'
          >
        >;
      };
    }
  >;
};

export const ProjectMemberListFragmentDoc = gql`
  fragment ProjectMemberList on ProjectMemberListOutput {
    items {
      user {
        value {
          id
          avatarLetters
          firstName
        }
      }
    }
  }
`;
