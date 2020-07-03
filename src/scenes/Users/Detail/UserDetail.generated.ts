/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export interface UserQueryVariables {
  userId: Types.Scalars['ID'];
}

export type UserQuery = { __typename?: 'Query' } & {
  user: { __typename?: 'User' } & UserDetailsFragment;
};

export type UserDetailsFragment = { __typename?: 'User' } & Pick<
  Types.User,
  'id' | 'fullName' | 'createdAt'
> & {
    email: { __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    bio: { __typename?: 'SecuredString' } & Pick<Types.SecuredString, 'value'>;
    phone: { __typename?: 'SecuredString' } & Pick<
      Types.SecuredString,
      'value'
    >;
    timezone: { __typename?: 'SecuredTimeZone' } & {
      value?: Types.Maybe<
        { __typename?: 'TimeZone' } & Pick<Types.TimeZone, 'name'>
      >;
    };
  };

export const UserDetailsFragmentDoc = gql`
  fragment userDetails on User {
    id
    email {
      value
    }
    fullName
    bio {
      value
    }
    phone {
      value
    }
    timezone {
      value {
        name
      }
    }
    createdAt
  }
`;
export const UserDocument = gql`
  query User($userId: ID!) {
    user(id: $userId) {
      ...userDetails
    }
  }
  ${UserDetailsFragmentDoc}
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
