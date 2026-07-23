import type * as Types from '~/api/schema.graphql';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type BudgetReferenceCountryFragment = (
  { readonly __typename?: 'BudgetReferenceCountry' }
  & Pick<Types.BudgetReferenceCountry, 'id' | 'name' | 'region' | 'keystoneCountryName' | 'currencyCode' | 'costOfLivingIndex' | 'indexMethodology' | 'adminFeeCap'>
);

export type BudgetReferenceCountriesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type BudgetReferenceCountriesQuery = { readonly budgetReferenceCountries: ReadonlyArray<(
    { readonly __typename?: 'BudgetReferenceCountry' }
    & Pick<Types.BudgetReferenceCountry, 'id' | 'name' | 'region' | 'keystoneCountryName' | 'currencyCode' | 'costOfLivingIndex' | 'indexMethodology' | 'adminFeeCap'>
  )> };

export const BudgetReferenceCountryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetReferenceCountry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetReferenceCountry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"keystoneCountryName"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"costOfLivingIndex"}},{"kind":"Field","name":{"kind":"Name","value":"indexMethodology"}},{"kind":"Field","name":{"kind":"Name","value":"adminFeeCap"}}]}}]} as unknown as DocumentNode<BudgetReferenceCountryFragment, unknown>;
export const BudgetReferenceCountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BudgetReferenceCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budgetReferenceCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetReferenceCountry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetReferenceCountry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetReferenceCountry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"keystoneCountryName"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"costOfLivingIndex"}},{"kind":"Field","name":{"kind":"Name","value":"indexMethodology"}},{"kind":"Field","name":{"kind":"Name","value":"adminFeeCap"}}]}}]} as unknown as DocumentNode<BudgetReferenceCountriesQuery, BudgetReferenceCountriesQueryVariables>;