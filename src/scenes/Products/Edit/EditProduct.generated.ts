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
import type {
  ProductForm_DerivativeScriptureProduct_Fragment,
  ProductForm_DirectScriptureProduct_Fragment,
} from '../ProductForm/ProductForm.generated';
import { ProductFormFragmentDoc } from '../ProductForm/ProductForm.generated';

export type UpdateProductMutationVariables = Types.Exact<{
  input: Types.UpdateProductInput;
}>;

export interface UpdateProductMutation {
  readonly updateProduct: { readonly __typename?: 'UpdateProductOutput' } & {
    readonly product:
      | ({
          readonly __typename?: 'DirectScriptureProduct';
        } & ProductForm_DirectScriptureProduct_Fragment)
      | ({
          readonly __typename?: 'DerivativeScriptureProduct';
        } & ProductForm_DerivativeScriptureProduct_Fragment);
  };
}

export type ProductQueryVariables = Types.Exact<{
  productId: Types.Scalars['ID'];
  projectId: Types.Scalars['ID'];
  engagementId: Types.Scalars['ID'];
}>;

export interface ProductQuery {
  readonly product:
    | ({
        readonly __typename?: 'DirectScriptureProduct';
      } & ProductForm_DirectScriptureProduct_Fragment)
    | ({
        readonly __typename?: 'DerivativeScriptureProduct';
      } & ProductForm_DerivativeScriptureProduct_Fragment);
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

export const UpdateProductDocument = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      product {
        ...ProductForm
      }
    }
  }
  ${ProductFormFragmentDoc}
`;
export type UpdateProductMutationFn = Apollo.MutationFunction<
  UpdateProductMutation,
  UpdateProductMutationVariables
>;

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProductMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateProductMutation,
    UpdateProductMutationVariables
  >
) {
  return Apollo.useMutation<
    UpdateProductMutation,
    UpdateProductMutationVariables
  >(UpdateProductDocument, baseOptions);
}
export type UpdateProductMutationHookResult = ReturnType<
  typeof useUpdateProductMutation
>;
export type UpdateProductMutationResult = Apollo.MutationResult<
  UpdateProductMutation
>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<
  UpdateProductMutation,
  UpdateProductMutationVariables
>;
export const ProductDocument = gql`
  query Product($productId: ID!, $projectId: ID!, $engagementId: ID!) {
    product(id: $productId) {
      ...ProductForm
    }
    project(id: $projectId) {
      ...ProjectBreadcrumb
    }
    engagement(id: $engagementId) {
      ...EngagementBreadcrumb
    }
  }
  ${ProductFormFragmentDoc}
  ${ProjectBreadcrumbFragmentDoc}
  ${EngagementBreadcrumbFragmentDoc}
`;

/**
 * __useProductQuery__
 *
 * To run a query within a React component, call `useProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductQuery({
 *   variables: {
 *      productId: // value for 'productId'
 *      projectId: // value for 'projectId'
 *      engagementId: // value for 'engagementId'
 *   },
 * });
 */
export function useProductQuery(
  baseOptions?: Apollo.QueryHookOptions<ProductQuery, ProductQueryVariables>
) {
  return Apollo.useQuery<ProductQuery, ProductQueryVariables>(
    ProductDocument,
    baseOptions
  );
}
export function useProductLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ProductQuery, ProductQueryVariables>
) {
  return Apollo.useLazyQuery<ProductQuery, ProductQueryVariables>(
    ProductDocument,
    baseOptions
  );
}
export type ProductQueryHookResult = ReturnType<typeof useProductQuery>;
export type ProductLazyQueryHookResult = ReturnType<typeof useProductLazyQuery>;
export type ProductQueryResult = Apollo.QueryResult<
  ProductQuery,
  ProductQueryVariables
>;
