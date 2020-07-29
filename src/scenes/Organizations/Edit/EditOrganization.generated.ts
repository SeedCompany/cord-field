/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import { OrgDetailsFragment } from '../Detail/OrganizationDetail.generated';
import { OrgDetailsFragmentDoc } from '../Detail/OrganizationDetail.generated';

export type UpdateOrganizationMutationVariables = Types.Exact<{
  input: Types.UpdateOrganizationInput;
}>;

export type UpdateOrganizationMutation = { __typename?: 'Mutation' } & {
  updateOrganization: { __typename?: 'UpdateOrganizationOutput' } & {
    organization: { __typename?: 'Organization' } & OrgDetailsFragment;
  };
};

export const UpdateOrganizationDocument = gql`
  mutation UpdateOrganization($input: UpdateOrganizationInput!) {
    updateOrganization(input: $input) {
      organization {
        ...orgDetails
      }
    }
  }
  ${OrgDetailsFragmentDoc}
`;
export type UpdateOrganizationMutationFn = ApolloReactCommon.MutationFunction<
  UpdateOrganizationMutation,
  UpdateOrganizationMutationVariables
>;

/**
 * __useUpdateOrganizationMutation__
 *
 * To run a mutation, you first call `useUpdateOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrganizationMutation, { data, loading, error }] = useUpdateOrganizationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateOrganizationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateOrganizationMutation,
    UpdateOrganizationMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateOrganizationMutation,
    UpdateOrganizationMutationVariables
  >(UpdateOrganizationDocument, baseOptions);
}
export type UpdateOrganizationMutationHookResult = ReturnType<
  typeof useUpdateOrganizationMutation
>;
export type UpdateOrganizationMutationResult = ApolloReactCommon.MutationResult<
  UpdateOrganizationMutation
>;
export type UpdateOrganizationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateOrganizationMutation,
  UpdateOrganizationMutationVariables
>;
