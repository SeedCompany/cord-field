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
export const GetProductBreadcrumbDocument = gql`
  query GetProductBreadcrumb($projectId: ID!, $engagementId: ID!) {
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetProductBreadcrumbQuery,
    GetProductBreadcrumbQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    GetProductBreadcrumbQuery,
    GetProductBreadcrumbQueryVariables
  >(GetProductBreadcrumbDocument, baseOptions);
}
export function useGetProductBreadcrumbLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetProductBreadcrumbQuery,
    GetProductBreadcrumbQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
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
export type GetProductBreadcrumbQueryResult = ApolloReactCommon.QueryResult<
  GetProductBreadcrumbQuery,
  GetProductBreadcrumbQueryVariables
>;
