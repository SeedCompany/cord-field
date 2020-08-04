/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import type * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import type * as Types from '../../../api/schema.generated';
import type {
  SsFragment,
  UserFormFragment,
} from '../UserForm/UserForm.generated';
import {
  SsFragmentDoc,
  UserFormFragmentDoc,
} from '../UserForm/UserForm.generated';

export type UserQueryVariables = Types.Exact<{
  userId: Types.Scalars['ID'];
}>;

export interface UserQuery {
  readonly user: { readonly __typename?: 'User' } & UserDetailsFragment &
    UserFormFragment;
}

export type UserDetailsFragment = { readonly __typename?: 'User' } & Pick<
  Types.User,
  'id' | 'fullName' | 'createdAt'
> & {
    readonly email: { readonly __typename?: 'SecuredString' } & SsFragment;
    readonly bio: { readonly __typename?: 'SecuredString' } & SsFragment;
    readonly phone: { readonly __typename?: 'SecuredString' } & SsFragment;
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
  };

export const UserDetailsFragmentDoc = gql`
  fragment userDetails on User {
    id
    email {
      ...ss
    }
    fullName
    bio {
      ...ss
    }
    phone {
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
    createdAt
  }
  ${SsFragmentDoc}
`;
export const UserDocument = gql`
  query User($userId: ID!) {
    user(id: $userId) {
      ...userDetails
      ...UserForm
    }
  }
  ${UserDetailsFragmentDoc}
  ${UserFormFragmentDoc}
`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<UserQuery, UserQueryVariables>
) {
  return ApolloReactHooks.useQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    baseOptions
  );
}
export function useUserLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UserQuery,
    UserQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    baseOptions
  );
}
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = ApolloReactCommon.QueryResult<
  UserQuery,
  UserQueryVariables
>;
