/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as Apollo from '@apollo/client';
import gql from 'graphql-tag';
import type * as Types from '../../../api/schema.generated';
import type {
  EngagementBreadcrumb_InternshipEngagement_Fragment,
  EngagementBreadcrumb_LanguageEngagement_Fragment,
} from '../../../components/EngagementBreadcrumb/EngagementBreadcrumb.generated';
import { EngagementBreadcrumbFragmentDoc } from '../../../components/EngagementBreadcrumb/EngagementBreadcrumb.generated';
import type {
  ProjectBreadcrumb_InternshipProject_Fragment,
  ProjectBreadcrumb_TranslationProject_Fragment,
} from '../../../components/ProjectBreadcrumb/ProjectBreadcrumb.generated';
import { ProjectBreadcrumbFragmentDoc } from '../../../components/ProjectBreadcrumb/ProjectBreadcrumb.generated';

export type CreateProductMutationVariables = Types.Exact<{
  input: Types.CreateProductInput;
}>;

export interface CreateProductMutation {
  readonly createProduct: { readonly __typename?: 'CreateProductOutput' } & {
    readonly product:
      | ({ readonly __typename?: 'DirectScriptureProduct' } & Pick<
          Types.DirectScriptureProduct,
          'id'
        >)
      | ({ readonly __typename?: 'DerivativeScriptureProduct' } & Pick<
          Types.DerivativeScriptureProduct,
          'id'
        >);
  };
}

export type GetProductBreadcrumbQueryVariables = Types.Exact<{
  projectId: Types.Scalars['ID'];
  engagementId: Types.Scalars['ID'];
}>;

export interface GetProductBreadcrumbQuery {
  readonly project:
    | ({
        readonly __typename?: 'TranslationProject';
      } & ProjectBreadcrumb_TranslationProject_Fragment)
    | ({
        readonly __typename?: 'InternshipProject';
      } & ProjectBreadcrumb_InternshipProject_Fragment);
  readonly engagement:
    | ({
        readonly __typename?: 'LanguageEngagement';
      } & EngagementBreadcrumb_LanguageEngagement_Fragment)
    | ({
        readonly __typename?: 'InternshipEngagement';
      } & EngagementBreadcrumb_InternshipEngagement_Fragment);
}

export const CreateProductDocument = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      product {
        id
      }
    }
  }
`;
export type CreateProductMutationFn = Apollo.MutationFunction<
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
  baseOptions?: Apollo.MutationHookOptions<
    CreateProductMutation,
    CreateProductMutationVariables
  >
) {
  return Apollo.useMutation<
    CreateProductMutation,
    CreateProductMutationVariables
  >(CreateProductDocument, baseOptions);
}
export type CreateProductMutationHookResult = ReturnType<
  typeof useCreateProductMutation
>;
export type CreateProductMutationResult = Apollo.MutationResult<
  CreateProductMutation
>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<
  CreateProductMutation,
  CreateProductMutationVariables
>;
export const GetProductBreadcrumbDocument = gql`
  query GetProductBreadcrumb($projectId: ID!, $engagementId: ID!) {
    project(id: $projectId) {
      ...ProjectBreadcrumb
    }
    engagement(id: $engagementId) {
      ...EngagementBreadcrumb
    }
  }
  ${ProjectBreadcrumbFragmentDoc}
  ${EngagementBreadcrumbFragmentDoc}
`;

/**
 * __useGetProductBreadcrumbQuery__
 *
 * To run a query within a React component, call `useGetProductBreadcrumbQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductBreadcrumbQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductBreadcrumbQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      engagementId: // value for 'engagementId'
 *   },
 * });
 */
export function useGetProductBreadcrumbQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetProductBreadcrumbQuery,
    GetProductBreadcrumbQueryVariables
  >
) {
  return Apollo.useQuery<
    GetProductBreadcrumbQuery,
    GetProductBreadcrumbQueryVariables
  >(GetProductBreadcrumbDocument, baseOptions);
}
export function useGetProductBreadcrumbLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProductBreadcrumbQuery,
    GetProductBreadcrumbQueryVariables
  >
) {
  return Apollo.useLazyQuery<
    GetProductBreadcrumbQuery,
    GetProductBreadcrumbQueryVariables
  >(GetProductBreadcrumbDocument, baseOptions);
}
export type GetProductBreadcrumbQueryHookResult = ReturnType<
  typeof useGetProductBreadcrumbQuery
>;
export type GetProductBreadcrumbLazyQueryHookResult = ReturnType<
  typeof useGetProductBreadcrumbLazyQuery
>;
export type GetProductBreadcrumbQueryResult = Apollo.QueryResult<
  GetProductBreadcrumbQuery,
  GetProductBreadcrumbQueryVariables
>;
