/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import type * as Types from '../../api/schema.generated';

export type ProjectMemberItemFragment = {
  readonly __typename?: 'ProjectMember';
} & {
  readonly user: { readonly __typename?: 'SecuredUser' } & Pick<
    Types.SecuredUser,
    'canRead' | 'canEdit'
  > & {
      readonly value?: Types.Maybe<
        { readonly __typename?: 'User' } & Pick<
          Types.User,
          'id' | 'avatarLetters' | 'firstName'
        >
      >;
    };
};

export const ProjectMemberItemFragmentDoc = gql`
  fragment ProjectMemberItem on ProjectMember {
    user {
      canRead
      canEdit
      value {
        id
        avatarLetters
        firstName
      }
    }
  }
`;
