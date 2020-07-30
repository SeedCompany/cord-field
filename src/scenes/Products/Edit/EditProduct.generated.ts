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

export type UpdateProductMutationVariables = Types.Exact<{
  input: Types.UpdateProductInput;
}>;

export interface UpdateProductMutation {
  readonly updateProduct: { readonly __typename?: 'UpdateProductOutput' } & {
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

export type ProductQueryVariables = Types.Exact<{
  productId: Types.Scalars['ID'];
  projectId: Types.Scalars['ID'];
  engagementId: Types.Scalars['ID'];
}>;

export interface ProductQuery {
  readonly product:
    | ({ readonly __typename?: 'DirectScriptureProduct' } & Pick<
        Types.DirectScriptureProduct,
        'id' | 'legacyType' | 'approach'
      > & {
          readonly scriptureReferences: {
            readonly __typename?: 'SecuredScriptureRanges';
          } & Pick<Types.SecuredScriptureRanges, 'canRead' | 'canEdit'> & {
              readonly value: ReadonlyArray<
                { readonly __typename?: 'ScriptureRange' } & {
                  readonly start: {
                    readonly __typename?: 'ScriptureReference';
                  } & Pick<
                    Types.ScriptureReference,
                    'book' | 'chapter' | 'verse'
                  >;
                  readonly end: {
                    readonly __typename?: 'ScriptureReference';
                  } & Pick<
                    Types.ScriptureReference,
                    'book' | 'chapter' | 'verse'
                  >;
                }
              >;
            };
          readonly mediums: {
            readonly __typename?: 'SecuredProductMediums';
          } & Pick<
            Types.SecuredProductMediums,
            'canRead' | 'canEdit' | 'value'
          >;
          readonly purposes: {
            readonly __typename?: 'SecuredProductPurposes';
          } & Pick<
            Types.SecuredProductPurposes,
            'canRead' | 'canEdit' | 'value'
          >;
          readonly methodology: {
            readonly __typename?: 'SecuredMethodology';
          } & Pick<Types.SecuredMethodology, 'canRead' | 'canEdit' | 'value'>;
        })
    | ({ readonly __typename?: 'DerivativeScriptureProduct' } & Pick<
        Types.DerivativeScriptureProduct,
        'id' | 'legacyType' | 'approach'
      > & {
          readonly produces: {
            readonly __typename?: 'SecuredProducible';
          } & Pick<Types.SecuredProducible, 'canRead' | 'canEdit'> & {
              readonly value?: Types.Maybe<
                | ({ readonly __typename: 'DirectScriptureProduct' } & Pick<
                    Types.DirectScriptureProduct,
                    'createdAt'
                  >)
                | ({ readonly __typename: 'DerivativeScriptureProduct' } & Pick<
                    Types.DerivativeScriptureProduct,
                    'createdAt'
                  >)
                | ({ readonly __typename: 'Film' } & Pick<
                    Types.Film,
                    'createdAt'
                  >)
                | ({ readonly __typename: 'LiteracyMaterial' } & Pick<
                    Types.LiteracyMaterial,
                    'createdAt'
                  >)
                | ({ readonly __typename: 'Story' } & Pick<
                    Types.Story,
                    'createdAt'
                  >)
                | ({ readonly __typename: 'Song' } & Pick<
                    Types.Song,
                    'createdAt'
                  >)
              >;
            };
          readonly scriptureReferencesOverride?: Types.Maybe<
            { readonly __typename?: 'SecuredScriptureRanges' } & Pick<
              Types.SecuredScriptureRanges,
              'canRead' | 'canEdit'
            > & {
                readonly value: ReadonlyArray<
                  { readonly __typename?: 'ScriptureRange' } & {
                    readonly start: {
                      readonly __typename?: 'ScriptureReference';
                    } & Pick<
                      Types.ScriptureReference,
                      'book' | 'chapter' | 'verse'
                    >;
                    readonly end: {
                      readonly __typename?: 'ScriptureReference';
                    } & Pick<
                      Types.ScriptureReference,
                      'book' | 'chapter' | 'verse'
                    >;
                  }
                >;
              }
          >;
          readonly scriptureReferences: {
            readonly __typename?: 'SecuredScriptureRanges';
          } & Pick<Types.SecuredScriptureRanges, 'canRead' | 'canEdit'> & {
              readonly value: ReadonlyArray<
                { readonly __typename?: 'ScriptureRange' } & {
                  readonly start: {
                    readonly __typename?: 'ScriptureReference';
                  } & Pick<
                    Types.ScriptureReference,
                    'book' | 'chapter' | 'verse'
                  >;
                  readonly end: {
                    readonly __typename?: 'ScriptureReference';
                  } & Pick<
                    Types.ScriptureReference,
                    'book' | 'chapter' | 'verse'
                  >;
                }
              >;
            };
          readonly mediums: {
            readonly __typename?: 'SecuredProductMediums';
          } & Pick<
            Types.SecuredProductMediums,
            'canRead' | 'canEdit' | 'value'
          >;
          readonly purposes: {
            readonly __typename?: 'SecuredProductPurposes';
          } & Pick<
            Types.SecuredProductPurposes,
            'canRead' | 'canEdit' | 'value'
          >;
          readonly methodology: {
            readonly __typename?: 'SecuredMethodology';
          } & Pick<Types.SecuredMethodology, 'canRead' | 'canEdit' | 'value'>;
        });
  readonly project:
    | ({
        readonly __typename?: 'TranslationProject';
      } & ProjectBreadcrumb_TranslationProject_Fragment)
    | ({
        readonly __typename?: 'InternshipProject';
      } & ProjectBreadcrumb_InternshipProject_Fragment);
  readonly engagement:
    | ({ readonly __typename?: 'LanguageEngagement' } & {
        readonly language: { readonly __typename?: 'SecuredLanguage' } & {
          readonly value?: Types.Maybe<
            { readonly __typename?: 'Language' } & {
              readonly name: { readonly __typename?: 'SecuredString' } & Pick<
                Types.SecuredString,
                'value'
              >;
            }
          >;
        };
      })
    | { readonly __typename?: 'InternshipEngagement' };
}

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
      ... on DerivativeScriptureProduct {
        produces {
          canRead
          canEdit
          value {
            __typename
            createdAt
          }
        }
        scriptureReferencesOverride {
          canRead
          canEdit
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
      }
      id
      legacyType
      scriptureReferences {
        canRead
        canEdit
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
        canRead
        canEdit
        value
      }
      purposes {
        canRead
        canEdit
        value
      }
      methodology {
        canRead
        canEdit
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
