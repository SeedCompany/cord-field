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

export interface UpdateProductMutationVariables {
  input: Types.UpdateProductInput;
}

export type UpdateProductMutation = { __typename?: 'Mutation' } & {
  updateProduct: { __typename?: 'UpdateProductOutput' } & {
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

export interface ProductQueryVariables {
  productId: Types.Scalars['ID'];
  projectId: Types.Scalars['ID'];
  engagementId: Types.Scalars['ID'];
}

export type ProductQuery = { __typename?: 'Query' } & {
  product:
    | ({ __typename?: 'DirectScriptureProduct' } & Pick<
        Types.DirectScriptureProduct,
        'id' | 'approach' | 'legacyType'
      > & {
          scriptureReferences: { __typename?: 'SecuredScriptureRanges' } & {
            value: Array<
              { __typename?: 'ScriptureRange' } & {
                start: { __typename?: 'ScriptureReference' } & Pick<
                  Types.ScriptureReference,
                  'book' | 'chapter' | 'verse'
                >;
                end: { __typename?: 'ScriptureReference' } & Pick<
                  Types.ScriptureReference,
                  'book' | 'chapter' | 'verse'
                >;
              }
            >;
          };
          mediums: { __typename?: 'SecuredProductMediums' } & Pick<
            Types.SecuredProductMediums,
            'value'
          >;
          purposes: { __typename?: 'SecuredProductPurposes' } & Pick<
            Types.SecuredProductPurposes,
            'value'
          >;
          methodology: { __typename?: 'SecuredMethodology' } & Pick<
            Types.SecuredMethodology,
            'value'
          >;
        })
    | ({ __typename?: 'DerivativeScriptureProduct' } & Pick<
        Types.DerivativeScriptureProduct,
        'id' | 'approach' | 'legacyType'
      > & {
          scriptureReferences: { __typename?: 'SecuredScriptureRanges' } & {
            value: Array<
              { __typename?: 'ScriptureRange' } & {
                start: { __typename?: 'ScriptureReference' } & Pick<
                  Types.ScriptureReference,
                  'book' | 'chapter' | 'verse'
                >;
                end: { __typename?: 'ScriptureReference' } & Pick<
                  Types.ScriptureReference,
                  'book' | 'chapter' | 'verse'
                >;
              }
            >;
          };
          mediums: { __typename?: 'SecuredProductMediums' } & Pick<
            Types.SecuredProductMediums,
            'value'
          >;
          purposes: { __typename?: 'SecuredProductPurposes' } & Pick<
            Types.SecuredProductPurposes,
            'value'
          >;
          methodology: { __typename?: 'SecuredMethodology' } & Pick<
            Types.SecuredMethodology,
            'value'
          >;
        });
  project:
    | ({
        __typename?: 'TranslationProject';
      } & ProjectBreadcrumb_TranslationProject_Fragment)
    | ({
        __typename?: 'InternshipProject';
      } & ProjectBreadcrumb_InternshipProject_Fragment);
  engagement:
    | ({ __typename?: 'LanguageEngagement' } & {
        language: { __typename?: 'SecuredLanguage' } & {
          value?: Types.Maybe<
            { __typename?: 'Language' } & {
              name: { __typename?: 'SecuredString' } & Pick<
                Types.SecuredString,
                'value'
              >;
            }
          >;
        };
      })
    | { __typename?: 'InternshipEngagement' };
};

export const UpdateProductDocument = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      product {
        id
      }
    }
  }
`;
export type UpdateProductMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateProductMutation,
    UpdateProductMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateProductMutation,
    UpdateProductMutationVariables
  >(UpdateProductDocument, baseOptions);
}
export type UpdateProductMutationHookResult = ReturnType<
  typeof useUpdateProductMutation
>;
export type UpdateProductMutationResult = ApolloReactCommon.MutationResult<
  UpdateProductMutation
>;
export type UpdateProductMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateProductMutation,
  UpdateProductMutationVariables
>;
export const ProductDocument = gql`
  query Product($productId: ID!, $projectId: ID!, $engagementId: ID!) {
    product(id: $productId) {
      id
      scriptureReferences {
        value {
          start {
            book
            chapter
            verse
          }
          end {
            book
            chapter
            verse
          }
        }
      }
      mediums {
        value
      }
      purposes {
        value
      }
      methodology {
        value
      }
      approach
      legacyType
    }
    project(id: $projectId) {
      ...ProjectBreadcrumb
    }
    engagement(id: $engagementId) {
      ... on LanguageEngagement {
        language {
          value {
            name {
              value
            }
          }
        }
      }
    }
  }
  ${ProjectBreadcrumbFragmentDoc}
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ProductQuery,
    ProductQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<ProductQuery, ProductQueryVariables>(
    ProductDocument,
    baseOptions
  );
}
export function useProductLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ProductQuery,
    ProductQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<ProductQuery, ProductQueryVariables>(
    ProductDocument,
    baseOptions
  );
}
export type ProductQueryHookResult = ReturnType<typeof useProductQuery>;
export type ProductLazyQueryHookResult = ReturnType<typeof useProductLazyQuery>;
export type ProductQueryResult = ApolloReactCommon.QueryResult<
  ProductQuery,
  ProductQueryVariables
>;
