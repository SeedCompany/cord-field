/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import { UserDetailsFragment } from '../Detail/UserDetail.generated';
import { UserDetailsFragmentDoc } from '../Detail/UserDetail.generated';

export type CreatePersonMutationVariables = Types.Exact<{
  input: Types.CreatePersonInput;
}>;

export interface CreatePersonMutation {
  readonly createPerson: { readonly __typename?: 'CreatePersonOutput' } & {
    readonly user: { readonly __typename?: 'User' } & Pick<
      Types.User,
      'id' | 'fullName'
    > &
      UserDetailsFragment;
  };
}

export const CreatePersonDocument = gql`
  mutation CreatePerson($input: CreatePersonInput!) {
    createPerson(input: $input) {
      user {
        id
        fullName
        ...userDetails
      }
    }
  }
  ${UserDetailsFragmentDoc}
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
