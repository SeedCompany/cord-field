/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import {
  ProjectBreadcrumb_InternshipProject_Fragment,
  ProjectBreadcrumb_TranslationProject_Fragment,
} from '../../../components/ProjectBreadcrumb/ProjectBreadcrumb.generated';
import { ProjectBreadcrumbFragmentDoc } from '../../../components/ProjectBreadcrumb/ProjectBreadcrumb.generated';

export interface CreateProductMutationVariables {
  input: Types.CreateProductInput;
}

export type CreateProductMutation = { __typename?: 'Mutation' } & {
  createProduct: { __typename?: 'CreateProductOutput' } & {
    product:
      | ({ __typename?: 'DirectScriptureProduct' } & Pick<
          Types.DirectScriptureProduct,
          'id'
        >)
      | ({ __typename?: 'DerivativeScriptureProduct' } & Pick<
          Types.DerivativeScriptureProduct,
          'id'
        >);
  };
};

export interface GetProjectBreadcrumbQueryVariables {
  input: Types.Scalars['ID'];
}

export type GetProjectBreadcrumbQuery = { __typename?: 'Query' } & {
  project:
    | ({
        __typename?: 'TranslationProject';
      } & ProjectBreadcrumb_TranslationProject_Fragment)
    | ({
        __typename?: 'InternshipProject';
      } & ProjectBreadcrumb_InternshipProject_Fragment);
};

export const CreateProductDocument = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      product {
        id
      }
    }
  }
`;
export type CreateProductMutationFn = ApolloReactCommon.MutationFunction<
  CreateProductMutation,
  CreateProductMutationVariables
>;

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateProductMutation,
    CreateProductMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateProductMutation,
    CreateProductMutationVariables
  >(CreateProductDocument, baseOptions);
}
export type CreateProductMutationHookResult = ReturnType<
  typeof useCreateProductMutation
>;
export type CreateProductMutationResult = ApolloReactCommon.MutationResult<
  CreateProductMutation
>;
export type CreateProductMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateProductMutation,
  CreateProductMutationVariables
>;
export const GetProjectBreadcrumbDocument = gql`
  query GetProjectBreadcrumb($input: ID!) {
    project(id: $input) {
      ...ProjectBreadcrumb
    }
  }
  ${ProjectBreadcrumbFragmentDoc}
`;

/**
 * __useGetProjectBreadcrumbQuery__
 *
 * To run a query within a React component, call `useGetProjectBreadcrumbQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectBreadcrumbQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectBreadcrumbQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetProjectBreadcrumbQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetProjectBreadcrumbQuery,
    GetProjectBreadcrumbQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetProjectBreadcrumbQuery,
    GetProjectBreadcrumbQueryVariables
  >(GetProjectBreadcrumbDocument, baseOptions);
}
export function useGetProjectBreadcrumbLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetProjectBreadcrumbQuery,
    GetProjectBreadcrumbQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    GetProjectBreadcrumbQuery,
    GetProjectBreadcrumbQueryVariables
  >(GetProjectBreadcrumbDocument, baseOptions);
}
export type GetProjectBreadcrumbQueryHookResult = ReturnType<
  typeof useGetProjectBreadcrumbQuery
>;
export type GetProjectBreadcrumbLazyQueryHookResult = ReturnType<
  typeof useGetProjectBreadcrumbLazyQuery
>;
export type GetProjectBreadcrumbQueryResult = ApolloReactCommon.QueryResult<
  GetProjectBreadcrumbQuery,
  GetProjectBreadcrumbQueryVariables
>;
