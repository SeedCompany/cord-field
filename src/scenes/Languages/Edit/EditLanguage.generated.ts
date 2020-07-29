/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import { LanguageDetailFragment } from '../Detail/LanguageDetail.generated';
import { LanguageDetailFragmentDoc } from '../Detail/LanguageDetail.generated';
import { LanguageFormFragment } from '../LanguageForm/LangugeForm.generated';
import { LanguageFormFragmentDoc } from '../LanguageForm/LangugeForm.generated';

export type UpdateLanguageMutationVariables = Types.Exact<{
  input: Types.UpdateLanguageInput;
}>;

export interface UpdateLanguageMutation {
  updateLanguage: { __typename?: 'UpdateLanguageOutput' } & {
    language: { __typename?: 'Language' } & LanguageDetailFragment &
      LanguageFormFragment;
  };
}

export const UpdateLanguageDocument = gql`
  mutation UpdateLanguage($input: UpdateLanguageInput!) {
    updateLanguage(input: $input) {
      language {
        ...LanguageDetail
        ...LanguageForm
      }
    }
  }
  ${LanguageDetailFragmentDoc}
  ${LanguageFormFragmentDoc}
`;
export type UpdateLanguageMutationFn = ApolloReactCommon.MutationFunction<
  UpdateLanguageMutation,
  UpdateLanguageMutationVariables
>;

/**
 * __useUpdateLanguageMutation__
 *
 * To run a mutation, you first call `useUpdateLanguageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLanguageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLanguageMutation, { data, loading, error }] = useUpdateLanguageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateLanguageMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateLanguageMutation,
    UpdateLanguageMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateLanguageMutation,
    UpdateLanguageMutationVariables
  >(UpdateLanguageDocument, baseOptions);
}
export type UpdateLanguageMutationHookResult = ReturnType<
  typeof useUpdateLanguageMutation
>;
export type UpdateLanguageMutationResult = ApolloReactCommon.MutationResult<
  UpdateLanguageMutation
>;
export type UpdateLanguageMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateLanguageMutation,
  UpdateLanguageMutationVariables
>;
