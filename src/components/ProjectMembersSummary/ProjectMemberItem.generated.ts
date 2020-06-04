/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type ProjectMemberItemFragment = { __typename?: 'ProjectMember' } & {
  user: { __typename?: 'SecuredUser' } & {
    value?: Types.Maybe<
      { __typename?: 'User' } & Pick<
        Types.User,
        'id' | 'avatarLetters' | 'firstName'
      >
    >;
  };
};

export const ProjectMemberItemFragmentDoc = gql`
  fragment ProjectMemberItem on ProjectMember {
    user {
      value {
        id
        avatarLetters
        firstName
      }
    }
  }
`;
