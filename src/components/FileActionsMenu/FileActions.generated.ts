/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export interface RenameFileNodeMutationVariables {
  input: Types.RenameFileInput;
}

export type RenameFileNodeMutation = { __typename?: 'Mutation' } & {
  renameFileNode:
    | ({ __typename?: 'Directory' } & Pick<Types.Directory, 'id' | 'name'>)
    | ({ __typename?: 'File' } & Pick<Types.File, 'id' | 'name'>)
    | ({ __typename?: 'FileVersion' } & Pick<Types.FileVersion, 'id' | 'name'>);
};

export const RenameFileNodeDocument = gql`
  mutation RenameFileNode($input: RenameFileInput!) {
    renameFileNode(input: $input) {
      id
      name
    }
  }
`;
export type RenameFileNodeMutationFn = ApolloReactCommon.MutationFunction<
  RenameFileNodeMutation,
  RenameFileNodeMutationVariables
>;

/**
 * __useRenameFileNodeMutation__
 *
 * To run a mutation, you first call `useRenameFileNodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameFileNodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameFileNodeMutation, { data, loading, error }] = useRenameFileNodeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRenameFileNodeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RenameFileNodeMutation,
    RenameFileNodeMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RenameFileNodeMutation,
    RenameFileNodeMutationVariables
  >(RenameFileNodeDocument, baseOptions);
}
export type RenameFileNodeMutationHookResult = ReturnType<
  typeof useRenameFileNodeMutation
>;
export type RenameFileNodeMutationResult = ApolloReactCommon.MutationResult<
  RenameFileNodeMutation
>;
export type RenameFileNodeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RenameFileNodeMutation,
  RenameFileNodeMutationVariables
>;
