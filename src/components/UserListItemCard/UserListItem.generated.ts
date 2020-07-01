/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type UserListItemFragment = { __typename?: 'User' } & Pick<
  Types.User,
  'id' | 'fullName' | 'avatarLetters'
> & {
    organizations: { __typename?: 'SecuredOrganizationList' } & {
      items: Array<
        { __typename?: 'Organization' } & Pick<Types.Organization, 'id'> & {
            name: { __typename?: 'SecuredString' } & Pick<
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
