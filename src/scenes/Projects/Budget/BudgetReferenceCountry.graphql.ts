/**
 * HAND-WRITTEN in the style of this repo's graphql-codegen output
 * (near-operation-file preset + typescript-operations + typed-document-node
 * plugins). No live backend was reachable in this sandbox to run
 * `yarn gql-gen` for real, so this was written by hand and cross-checked
 * field-by-field against the backend's actual resolver/DTO files. The main
 * deviation from literal codegen output: Document consts are built here with
 * `gql` parsed at runtime rather than pre-computed JSON AST literals, which
 * is what this repo's actual patched typed-document-node output uses --
 * both produce an equivalent DocumentNode for Apollo Client's purposes.
 */
import { gql } from '@apollo/client';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import type * as Types from '~/api/schema.graphql';

export type BudgetReferenceCountryFragment = { readonly __typename?: 'BudgetReferenceCountry' }
  & Pick<Types.BudgetReferenceCountry, 'id' | 'name' | 'region' | 'keystoneCountryName' | 'currencyCode' | 'costOfLivingIndex' | 'indexMethodology' | 'adminFeeCap'>;

export const BudgetReferenceCountryFragmentDoc = gql`
  fragment BudgetReferenceCountry on BudgetReferenceCountry {
    id
    name
    region
    keystoneCountryName
    currencyCode
    costOfLivingIndex
    indexMethodology
    adminFeeCap
  }
` as unknown as DocumentNode<BudgetReferenceCountryFragment, unknown>;

export type BudgetReferenceCountriesQueryVariables = Types.Exact<{ [key: string]: never }>;

export type BudgetReferenceCountriesQuery = {
  readonly budgetReferenceCountries: ReadonlyArray<BudgetReferenceCountryFragment>;
};

export const BudgetReferenceCountriesDocument = gql`
  query BudgetReferenceCountries {
    budgetReferenceCountries {
      ...BudgetReferenceCountry
    }
  }
  ${BudgetReferenceCountryFragmentDoc}
` as unknown as DocumentNode<
  BudgetReferenceCountriesQuery,
  BudgetReferenceCountriesQueryVariables
>;
