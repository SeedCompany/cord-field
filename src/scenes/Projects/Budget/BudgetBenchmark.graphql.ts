import type * as Types from '~/api/schema.graphql';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type BudgetBenchmarkQueryVariables = Types.Exact<{
  input: Types.BudgetBenchmarkInput;
}>;


export type BudgetBenchmarkQuery = { readonly budgetBenchmark?: Types.Maybe<(
    { readonly __typename?: 'BudgetBenchmarkResult' }
    & Pick<Types.BudgetBenchmarkResult, 'weeklyOrAnnualFigure' | 'fiscalYearAmounts'>
  )> };


export const BudgetBenchmarkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BudgetBenchmark"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetBenchmarkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budgetBenchmark"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weeklyOrAnnualFigure"}},{"kind":"Field","name":{"kind":"Name","value":"fiscalYearAmounts"}}]}}]}}]} as unknown as DocumentNode<BudgetBenchmarkQuery, BudgetBenchmarkQueryVariables>;