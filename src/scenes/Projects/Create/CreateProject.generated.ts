/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

export type CreateProjectMutationVariables = Types.Exact<{
  input: Types.CreateProjectInput;
}>;

export type CreateProjectMutation = { __typename?: 'Mutation' } & {
  createProject: { __typename?: 'CreateProjectOutput' } & {
    project:
      | ({ __typename?: 'TranslationProject' } & Pick<
          Types.TranslationProject,
          'id' | 'type' | 'createdAt'
        > & {
            name: { __typename?: 'SecuredString' } & Pick<
              Types.SecuredString,
              'value' | 'canRead' | 'canEdit'
            >;
          })
      | ({ __typename?: 'InternshipProject' } & Pick<
          Types.InternshipProject,
          'id' | 'type' | 'createdAt'
        > & {
            name: { __typename?: 'SecuredString' } & Pick<
              Types.SecuredString,
              'value' | 'canRead' | 'canEdit'
            >;
          });
  };
};

export const CreateProjectDocument = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      project {
        id
        name {
          value
          canRead
          canEdit
        }
        type
        createdAt
      }
    }
  }
`;
export type CreateProjectMutationFn = ApolloReactCommon.MutationFunction<
  CreateProjectMutation,
  CreateProjectMutationVariables
>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProjectMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >(CreateProjectDocument, baseOptions);
}
export type CreateProjectMutationHookResult = ReturnType<
  typeof useCreateProjectMutation
>;
export type CreateProjectMutationResult = ApolloReactCommon.MutationResult<
  CreateProjectMutation
>;
export type CreateProjectMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateProjectMutation,
  CreateProjectMutationVariables
>;
