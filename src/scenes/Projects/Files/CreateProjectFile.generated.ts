/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export interface CreateProjectDirectoryMutationVariables {
  input: Types.CreateDirectoryInput;
}

export type CreateProjectDirectoryMutation = { __typename?: 'Mutation' } & {
  createDirectory: { __typename?: 'Directory' } & Pick<
    Types.Directory,
    'id' | 'name'
  >;
};

export const CreateProjectDirectoryDocument = gql`
  mutation CreateProjectDirectory($input: CreateDirectoryInput!) {
    createDirectory(input: $input) {
      id
      name
    }
  }
`;
export type CreateProjectDirectoryMutationFn = ApolloReactCommon.MutationFunction<
  CreateProjectDirectoryMutation,
  CreateProjectDirectoryMutationVariables
>;

/**
 * __useCreateProjectDirectoryMutation__
 *
 * To run a mutation, you first call `useCreateProjectDirectoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectDirectoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectDirectoryMutation, { data, loading, error }] = useCreateProjectDirectoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProjectDirectoryMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateProjectDirectoryMutation,
    CreateProjectDirectoryMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateProjectDirectoryMutation,
    CreateProjectDirectoryMutationVariables
  >(CreateProjectDirectoryDocument, baseOptions);
}
export type CreateProjectDirectoryMutationHookResult = ReturnType<
  typeof useCreateProjectDirectoryMutation
>;
export type CreateProjectDirectoryMutationResult = ApolloReactCommon.MutationResult<
  CreateProjectDirectoryMutation
>;
export type CreateProjectDirectoryMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateProjectDirectoryMutation,
  CreateProjectDirectoryMutationVariables
>;
