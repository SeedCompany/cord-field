/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export type UserFormFragment = { __typename?: 'User' } & Pick<
  Types.User,
  'id'
> & {
    realFirstName: { __typename?: 'SecuredString' } & SsFragment;
    realLastName: { __typename?: 'SecuredString' } & SsFragment;
    displayFirstName: { __typename?: 'SecuredString' } & SsFragment;
    displayLastName: { __typename?: 'SecuredString' } & SsFragment;
    email: { __typename?: 'SecuredString' } & SsFragment;
    timezone: { __typename?: 'SecuredTimeZone' } & Pick<
      Types.SecuredTimeZone,
      'canRead' | 'canEdit'
    > & {
        value?: Types.Maybe<
          { __typename?: 'TimeZone' } & Pick<Types.TimeZone, 'name'> & {
              countries: Array<
                { __typename?: 'IanaCountry' } & Pick<
                  Types.IanaCountry,
                  'code' | 'name'
                >
              >;
            }
        >;
      };
    phone: { __typename?: 'SecuredString' } & SsFragment;
    bio: { __typename?: 'SecuredString' } & SsFragment;
  };

export type SsFragment = { __typename?: 'SecuredString' } & Pick<
  Types.SecuredString,
  'value' | 'canRead' | 'canEdit'
>;

export const SsFragmentDoc = gql`
  fragment ss on SecuredString {
    value
    canRead
    canEdit
  }
`;
export const UserFormFragmentDoc = gql`
  fragment UserForm on User {
    id
    realFirstName {
      ...ss
    }
    realLastName {
      ...ss
    }
    displayFirstName {
      ...ss
    }
    displayLastName {
      ...ss
    }
    email {
      ...ss
    }
    timezone {
      value {
        name
        countries {
          code
          name
        }
      }
      canRead
      canEdit
    }
    phone {
      ...ss
    }
    bio {
      ...ss
    }
  }
  ${SsFragmentDoc}
`;
