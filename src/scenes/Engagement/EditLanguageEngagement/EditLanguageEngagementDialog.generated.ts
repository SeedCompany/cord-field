/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import { LanguageEngagementDetailFragment } from '../LanguageEngagement/LanguageEngagementDetail.generated';
import { LanguageEngagementDetailFragmentDoc } from '../LanguageEngagement/LanguageEngagementDetail.generated';

export interface UpdateLanguageEngagementMutationVariables {
  input: Types.UpdateLanguageEngagementInput;
}

export type UpdateLanguageEngagementMutation = { __typename?: 'Mutation' } & {
  updateLanguageEngagement: {
    __typename?: 'UpdateLanguageEngagementOutput';
  } & {
    engagement: {
      __typename?: 'LanguageEngagement';
    } & LanguageEngagementDetailFragment;
  };
};

export const UpdateLanguageEngagementDocument = gql`
  mutation UpdateLanguageEngagement($input: UpdateLanguageEngagementInput!) {
    updateLanguageEngagement(input: $input) {
      engagement {
        ...LanguageEngagementDetail
      }
    }
  }
  ${LanguageEngagementDetailFragmentDoc}
`;
export type UpdateLanguageEngagementMutationFn = ApolloReactCommon.MutationFunction<
  UpdateLanguageEngagementMutation,
  UpdateLanguageEngagementMutationVariables
>;

/**
 * __useUpdateLanguageEngagementMutation__
 *
 * To run a mutation, you first call `useUpdateLanguageEngagementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLanguageEngagementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLanguageEngagementMutation, { data, loading, error }] = useUpdateLanguageEngagementMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateLanguageEngagementMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateLanguageEngagementMutation,
    UpdateLanguageEngagementMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateLanguageEngagementMutation,
    UpdateLanguageEngagementMutationVariables
  >(UpdateLanguageEngagementDocument, baseOptions);
}
export type UpdateLanguageEngagementMutationHookResult = ReturnType<
  typeof useUpdateLanguageEngagementMutation
>;
export type UpdateLanguageEngagementMutationResult = ApolloReactCommon.MutationResult<
  UpdateLanguageEngagementMutation
>;
export type UpdateLanguageEngagementMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateLanguageEngagementMutation,
  UpdateLanguageEngagementMutationVariables
>;
