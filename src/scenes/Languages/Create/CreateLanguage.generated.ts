/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import type * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import type * as Types from '../../../api/schema.generated';

export type CreateLanguageMutationVariables = Types.Exact<{
  input: Types.CreateLanguageInput;
}>;

export interface CreateLanguageMutation {
  readonly createLanguage: { readonly __typename?: 'CreateLanguageOutput' } & {
    readonly language: { readonly __typename?: 'Language' } & Pick<
      Types.Language,
      'id' | 'createdAt'
    > & {
        readonly name: { readonly __typename?: 'SecuredString' } & Pick<
          Types.SecuredString,
          'value' | 'canRead' | 'canEdit'
        >;
      };
  };
}

export const CreateLanguageDocument = gql`
  mutation createLanguage($input: CreateLanguageInput!) {
    createLanguage(input: $input) {
      language {
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
export type CreateLanguageMutationFn = ApolloReactCommon.MutationFunction<
  CreateLanguageMutation,
  CreateLanguageMutationVariables
>;

/**
 * __useCreateLanguageMutation__
 *
 * To run a mutation, you first call `useCreateLanguageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLanguageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLanguageMutation, { data, loading, error }] = useCreateLanguageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLanguageMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateLanguageMutation,
    CreateLanguageMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateLanguageMutation,
    CreateLanguageMutationVariables
  >(CreateLanguageDocument, baseOptions);
}
export type CreateLanguageMutationHookResult = ReturnType<
  typeof useCreateLanguageMutation
>;
export type CreateLanguageMutationResult = ApolloReactCommon.MutationResult<
  CreateLanguageMutation
>;
export type CreateLanguageMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateLanguageMutation,
  CreateLanguageMutationVariables
>;
