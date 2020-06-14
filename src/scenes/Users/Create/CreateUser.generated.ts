/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import { LoggedInUserFragment } from '../../../components/Session/session.generated';
import { LoggedInUserFragmentDoc } from '../../../components/Session/session.generated';

export interface CreatePersonMutationVariables {
  input: Types.CreatePersonInput;
}

export type CreatePersonMutation = { __typename?: 'Mutation' } & {
  createPerson: { __typename?: 'CreatePersonOutput' } & {
    user: { __typename?: 'User' } & LoggedInUserFragment;
  };
};

export const CreatePersonDocument = gql`
  mutation CreatePerson($input: CreatePersonInput!) {
    createPerson(input: $input) {
      user {
        ...LoggedInUser
      }
    }
  }
  ${LoggedInUserFragmentDoc}
`;
export type CreatePersonMutationFn = ApolloReactCommon.MutationFunction<
  CreatePersonMutation,
  CreatePersonMutationVariables
>;

/**
 * __useCreatePersonMutation__
 *
 * To run a mutation, you first call `useCreatePersonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePersonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPersonMutation, { data, loading, error }] = useCreatePersonMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePersonMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreatePersonMutation,
    CreatePersonMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreatePersonMutation,
    CreatePersonMutationVariables
  >(CreatePersonDocument, baseOptions);
}
export type CreatePersonMutationHookResult = ReturnType<
  typeof useCreatePersonMutation
>;
export type CreatePersonMutationResult = ApolloReactCommon.MutationResult<
  CreatePersonMutation
>;
export type CreatePersonMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreatePersonMutation,
  CreatePersonMutationVariables
>;
