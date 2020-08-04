/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import type * as Types from '../../api/schema.generated';

export type UserListItemFragment = { readonly __typename?: 'User' } & Pick<
  Types.User,
  'id' | 'fullName' | 'avatarLetters'
> & {
    readonly organizations: {
      readonly __typename?: 'SecuredOrganizationList';
    } & {
      readonly items: ReadonlyArray<
        { readonly __typename?: 'Organization' } & Pick<
          Types.Organization,
          'id'
        > & {
            readonly name: { readonly __typename?: 'SecuredString' } & Pick<
              Types.SecuredString,
              'value'
            >;
          }
      >;
    };
  };

export const UserListItemFragmentDoc = gql`
  fragment UserListItem on User {
    id
    fullName
    avatarLetters
    organizations(input: { count: 1 }) {
      items {
        id
        name {
          value
        }
      }
    }
  }
`;
