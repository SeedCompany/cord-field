/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type UserListItemFragment = { __typename?: 'User' } & Pick<
  Types.User,
  'id' | 'fullName'
> & {
    displayFirstName: { __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    displayLastName: { __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
  };

export const UserListItemFragmentDoc = gql`
  fragment UserListItem on User {
    id
    fullName
    displayFirstName {
      value
    }
    displayLastName {
      value
    }
  }
`;
