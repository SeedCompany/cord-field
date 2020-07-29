/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export type CreateOrganizationMutationVariables = Types.Exact<{
  input: Types.CreateOrganizationInput;
}>;

export type CreateOrganizationMutation = { __typename?: 'Mutation' } & {
  createOrganization: { __typename?: 'CreateOrganizationOutput' } & {
    organization: { __typename?: 'Organization' } & Pick<
      Types.Organization,
      'id' | 'createdAt'
    > & {
        name: { __typename?: 'SecuredString' } & Pick<
          Types.SecuredString,
          'value' | 'canRead' | 'canEdit'
        >;
      };
  };
};

export const CreateOrganizationDocument = gql`
  mutation createOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      organization {
        id
        name {
          value
          canRead
          canEdit
        }
        createdAt
      }
    }
  }
`;
export type CreateOrganizationMutationFn = ApolloReactCommon.MutationFunction<
  CreateOrganizationMutation,
  CreateOrganizationMutationVariables
>;

/**
 * __useCreateOrganizationMutation__
 *
 * To run a mutation, you first call `useCreateOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrganizationMutation, { data, loading, error }] = useCreateOrganizationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOrganizationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateOrganizationMutation,
    CreateOrganizationMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateOrganizationMutation,
    CreateOrganizationMutationVariables
  >(CreateOrganizationDocument, baseOptions);
}
export type CreateOrganizationMutationHookResult = ReturnType<
  typeof useCreateOrganizationMutation
>;
export type CreateOrganizationMutationResult = ApolloReactCommon.MutationResult<
  CreateOrganizationMutation
>;
export type CreateOrganizationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateOrganizationMutation,
  CreateOrganizationMutationVariables
>;
