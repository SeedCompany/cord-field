/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */

import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export interface RequestFileUploadMutationVariables {}

export type RequestFileUploadMutation = { __typename?: 'Mutation' } & {
  requestFileUpload: { __typename?: 'RequestUploadOutput' } & Pick<
    Types.RequestUploadOutput,
    'id' | 'url'
  >;
};

export interface CreateFileVersionMutationVariables {
  input: Types.CreateFileVersionInput;
}

export type CreateFileVersionMutation = { __typename?: 'Mutation' } & {
  createFileVersion: { __typename?: 'File' } & Pick<
    Types.File,
    'category' | 'downloadUrl' | 'id' | 'mimeType' | 'name' | 'size' | 'type'
  >;
};

export interface DeleteFileNodeMutationVariables {
  id: Types.Scalars['ID'];
}

export type DeleteFileNodeMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'deleteFileNode'
>;

export const RequestFileUploadDocument = gql`
  mutation RequestFileUpload {
    requestFileUpload {
      id
      url
    }
  }
`;
export type RequestFileUploadMutationFn = ApolloReactCommon.MutationFunction<
  RequestFileUploadMutation,
  RequestFileUploadMutationVariables
>;

/**
 * __useRequestFileUploadMutation__
 *
 * To run a mutation, you first call `useRequestFileUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestFileUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestFileUploadMutation, { data, loading, error }] = useRequestFileUploadMutation({
 *   variables: {
 *   },
 * });
 */
export function useRequestFileUploadMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RequestFileUploadMutation,
    RequestFileUploadMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RequestFileUploadMutation,
    RequestFileUploadMutationVariables
  >(RequestFileUploadDocument, baseOptions);
}
export type RequestFileUploadMutationHookResult = ReturnType<
  typeof useRequestFileUploadMutation
>;
export type RequestFileUploadMutationResult = ApolloReactCommon.MutationResult<
  RequestFileUploadMutation
>;
export type RequestFileUploadMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RequestFileUploadMutation,
  RequestFileUploadMutationVariables
>;
export const CreateFileVersionDocument = gql`
  mutation CreateFileVersion($input: CreateFileVersionInput!) {
    createFileVersion(input: $input) {
      category
      downloadUrl
      id
      mimeType
      name
      size
      type
    }
  }
`;
export type CreateFileVersionMutationFn = ApolloReactCommon.MutationFunction<
  CreateFileVersionMutation,
  CreateFileVersionMutationVariables
>;

/**
 * __useCreateFileVersionMutation__
 *
 * To run a mutation, you first call `useCreateFileVersionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFileVersionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFileVersionMutation, { data, loading, error }] = useCreateFileVersionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateFileVersionMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateFileVersionMutation,
    CreateFileVersionMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateFileVersionMutation,
    CreateFileVersionMutationVariables
  >(CreateFileVersionDocument, baseOptions);
}
export type CreateFileVersionMutationHookResult = ReturnType<
  typeof useCreateFileVersionMutation
>;
export type CreateFileVersionMutationResult = ApolloReactCommon.MutationResult<
  CreateFileVersionMutation
>;
export type CreateFileVersionMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateFileVersionMutation,
  CreateFileVersionMutationVariables
>;
export const DeleteFileNodeDocument = gql`
  mutation DeleteFileNode($id: ID!) {
    deleteFileNode(id: $id)
  }
`;
export type DeleteFileNodeMutationFn = ApolloReactCommon.MutationFunction<
  DeleteFileNodeMutation,
  DeleteFileNodeMutationVariables
>;

/**
 * __useDeleteFileNodeMutation__
 *
 * To run a mutation, you first call `useDeleteFileNodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFileNodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFileNodeMutation, { data, loading, error }] = useDeleteFileNodeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFileNodeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteFileNodeMutation,
    DeleteFileNodeMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    DeleteFileNodeMutation,
    DeleteFileNodeMutationVariables
  >(DeleteFileNodeDocument, baseOptions);
}
export type DeleteFileNodeMutationHookResult = ReturnType<
  typeof useDeleteFileNodeMutation
>;
export type DeleteFileNodeMutationResult = ApolloReactCommon.MutationResult<
  DeleteFileNodeMutation
>;
export type DeleteFileNodeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeleteFileNodeMutation,
  DeleteFileNodeMutationVariables
>;
