/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import { LoggedInUserFragment } from '../../../components/Session/session.generated';
import { LoggedInUserFragmentDoc } from '../../../components/Session/session.generated';

export interface RegisterMutationVariables {
  input: Types.CreateUserInput;
}

export type RegisterMutation = { __typename?: 'Mutation' } & {
  createUser: { __typename?: 'CreateUserOutput' } & {
    user: { __typename?: 'User' } & LoggedInUserFragment;
  };
};

export const RegisterDocument = gql`
  mutation Register($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        ...LoggedInUser
      }
    }
  }
  ${LoggedInUserFragmentDoc}
`;
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RegisterMutation,
    RegisterMutationVariables
  >(RegisterDocument, baseOptions);
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<
  RegisterMutation
>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;
