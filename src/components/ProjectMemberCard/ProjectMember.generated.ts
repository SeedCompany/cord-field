/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import type * as Types from '../../api/schema.generated';

export type ProjectMemberCardFragment = {
  readonly __typename?: 'ProjectMember';
} & Pick<Types.ProjectMember, 'id' | 'createdAt'> & {
    readonly user: { readonly __typename?: 'SecuredUser' } & {
      readonly value?: Types.Maybe<
        { readonly __typename?: 'User' } & Pick<
          Types.User,
          'fullName' | 'avatarLetters'
        >
      >;
    };
    readonly roles: { readonly __typename?: 'SecuredRoles' } & Pick<
      Types.SecuredRoles,
      'value' | 'canRead'
    >;
  };

export const ProjectMemberCardFragmentDoc = gql`
  fragment ProjectMemberCard on ProjectMember {
    id
    createdAt
    user {
      value {
        fullName
        avatarLetters
      }
    }
    roles {
      value
      canRead
    }
  }
`;
