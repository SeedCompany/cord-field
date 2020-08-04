/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import type * as Types from '../../../api/schema.generated';

export type UserFormFragment = { readonly __typename?: 'User' } & Pick<
  Types.User,
  'id'
> & {
    readonly realFirstName: {
      readonly __typename?: 'SecuredString';
    } & SsFragment;
    readonly realLastName: {
      readonly __typename?: 'SecuredString';
    } & SsFragment;
    readonly displayFirstName: {
      readonly __typename?: 'SecuredString';
    } & SsFragment;
    readonly displayLastName: {
      readonly __typename?: 'SecuredString';
    } & SsFragment;
    readonly email: { readonly __typename?: 'SecuredString' } & SsFragment;
    readonly timezone: { readonly __typename?: 'SecuredTimeZone' } & Pick<
      Types.SecuredTimeZone,
      'canRead' | 'canEdit'
    > & {
        readonly value?: Types.Maybe<
          { readonly __typename?: 'TimeZone' } & Pick<
            Types.TimeZone,
            'name'
          > & {
              readonly countries: ReadonlyArray<
                { readonly __typename?: 'IanaCountry' } & Pick<
                  Types.IanaCountry,
                  'code' | 'name'
                >
              >;
            }
        >;
      };
    readonly phone: { readonly __typename?: 'SecuredString' } & SsFragment;
    readonly bio: { readonly __typename?: 'SecuredString' } & SsFragment;
  };

export type SsFragment = { readonly __typename?: 'SecuredString' } & Pick<
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
