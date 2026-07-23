import type * as Types from '~/api/schema.graphql';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type BudgetLineItemFragment = (
  { readonly __typename?: 'BudgetLineItem' }
  & Pick<Types.BudgetLineItem, 'id' | 'createdAt' | 'canDelete'>
  & { readonly account: (
    { readonly __typename?: 'SecuredStringNullable' }
    & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>
  ), readonly description: (
    { readonly __typename?: 'SecuredStringNullable' }
    & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>
  ), readonly costType: (
    { readonly __typename?: 'SecuredString' }
    & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
  ), readonly budgetCategory: (
    { readonly __typename?: 'SecuredString' }
    & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
  ), readonly activity: (
    { readonly __typename?: 'SecuredStringNullable' }
    & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>
  ), readonly serviceProvider: (
    { readonly __typename?: 'SecuredOrganizationNullable' }
    & Pick<Types.SecuredOrganizationNullable, 'canRead' | 'canEdit'>
    & { readonly value?: Types.Maybe<(
      { readonly __typename?: 'Organization' }
      & Pick<Types.Organization, 'id' | 'createdAt'>
      & { readonly name: (
        { readonly __typename?: 'SecuredString' }
        & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
      ) }
    )> }
  ), readonly funder: (
    { readonly __typename?: 'SecuredOrganizationNullable' }
    & Pick<Types.SecuredOrganizationNullable, 'canRead' | 'canEdit'>
    & { readonly value?: Types.Maybe<(
      { readonly __typename?: 'Organization' }
      & Pick<Types.Organization, 'id' | 'createdAt'>
      & { readonly name: (
        { readonly __typename?: 'SecuredString' }
        & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
      ) }
    )> }
  ), readonly fiscalYearAmounts: (
    { readonly __typename?: 'SecuredFiscalYearAmounts' }
    & Pick<Types.SecuredFiscalYearAmounts, 'canRead' | 'canEdit' | 'value'>
  ) }
);

export type CreateBudgetLineItemMutationVariables = Types.Exact<{
  input: Types.CreateBudgetLineItem;
}>;


export type CreateBudgetLineItemMutation = { readonly createBudgetLineItem: (
    { readonly __typename?: 'BudgetLineItemCreated' }
    & { readonly budgetLineItem: (
      { readonly __typename?: 'BudgetLineItem' }
      & Pick<Types.BudgetLineItem, 'id' | 'createdAt' | 'canDelete'>
      & { readonly account: (
        { readonly __typename?: 'SecuredStringNullable' }
        & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>
      ), readonly description: (
        { readonly __typename?: 'SecuredStringNullable' }
        & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>
      ), readonly costType: (
        { readonly __typename?: 'SecuredString' }
        & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
      ), readonly budgetCategory: (
        { readonly __typename?: 'SecuredString' }
        & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
      ), readonly activity: (
        { readonly __typename?: 'SecuredStringNullable' }
        & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>
      ), readonly serviceProvider: (
        { readonly __typename?: 'SecuredOrganizationNullable' }
        & Pick<Types.SecuredOrganizationNullable, 'canRead' | 'canEdit'>
        & { readonly value?: Types.Maybe<(
          { readonly __typename?: 'Organization' }
          & Pick<Types.Organization, 'id' | 'createdAt'>
          & { readonly name: (
            { readonly __typename?: 'SecuredString' }
            & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
          ) }
        )> }
      ), readonly funder: (
        { readonly __typename?: 'SecuredOrganizationNullable' }
        & Pick<Types.SecuredOrganizationNullable, 'canRead' | 'canEdit'>
        & { readonly value?: Types.Maybe<(
          { readonly __typename?: 'Organization' }
          & Pick<Types.Organization, 'id' | 'createdAt'>
          & { readonly name: (
            { readonly __typename?: 'SecuredString' }
            & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
          ) }
        )> }
      ), readonly fiscalYearAmounts: (
        { readonly __typename?: 'SecuredFiscalYearAmounts' }
        & Pick<Types.SecuredFiscalYearAmounts, 'canRead' | 'canEdit' | 'value'>
      ) }
    ) }
  ) };

export type UpdateBudgetLineItemMutationVariables = Types.Exact<{
  input: Types.UpdateBudgetLineItem;
}>;


export type UpdateBudgetLineItemMutation = { readonly updateBudgetLineItem: (
    { readonly __typename?: 'BudgetLineItemUpdated' }
    & { readonly budgetLineItem: (
      { readonly __typename?: 'BudgetLineItem' }
      & Pick<Types.BudgetLineItem, 'id' | 'createdAt' | 'canDelete'>
      & { readonly account: (
        { readonly __typename?: 'SecuredStringNullable' }
        & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>
      ), readonly description: (
        { readonly __typename?: 'SecuredStringNullable' }
        & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>
      ), readonly costType: (
        { readonly __typename?: 'SecuredString' }
        & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
      ), readonly budgetCategory: (
        { readonly __typename?: 'SecuredString' }
        & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
      ), readonly activity: (
        { readonly __typename?: 'SecuredStringNullable' }
        & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>
      ), readonly serviceProvider: (
        { readonly __typename?: 'SecuredOrganizationNullable' }
        & Pick<Types.SecuredOrganizationNullable, 'canRead' | 'canEdit'>
        & { readonly value?: Types.Maybe<(
          { readonly __typename?: 'Organization' }
          & Pick<Types.Organization, 'id' | 'createdAt'>
          & { readonly name: (
            { readonly __typename?: 'SecuredString' }
            & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
          ) }
        )> }
      ), readonly funder: (
        { readonly __typename?: 'SecuredOrganizationNullable' }
        & Pick<Types.SecuredOrganizationNullable, 'canRead' | 'canEdit'>
        & { readonly value?: Types.Maybe<(
          { readonly __typename?: 'Organization' }
          & Pick<Types.Organization, 'id' | 'createdAt'>
          & { readonly name: (
            { readonly __typename?: 'SecuredString' }
            & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
          ) }
        )> }
      ), readonly fiscalYearAmounts: (
        { readonly __typename?: 'SecuredFiscalYearAmounts' }
        & Pick<Types.SecuredFiscalYearAmounts, 'canRead' | 'canEdit' | 'value'>
      ) }
    ) }
  ) };

export type DeleteBudgetLineItemMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteBudgetLineItemMutation = { readonly deleteBudgetLineItem: { readonly __typename: 'BudgetLineItemDeleted' } };

export const BudgetLineItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetLineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetLineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"costType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"budgetCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serviceProvider"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"funder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fiscalYearAmounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<BudgetLineItemFragment, unknown>;
export const CreateBudgetLineItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBudgetLineItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBudgetLineItem"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBudgetLineItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budgetLineItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetLineItem"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetLineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetLineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"costType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"budgetCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serviceProvider"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"funder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fiscalYearAmounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<CreateBudgetLineItemMutation, CreateBudgetLineItemMutationVariables>;
export const UpdateBudgetLineItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBudgetLineItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBudgetLineItem"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBudgetLineItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budgetLineItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetLineItem"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetLineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetLineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"costType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"budgetCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serviceProvider"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"funder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fiscalYearAmounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<UpdateBudgetLineItemMutation, UpdateBudgetLineItemMutationVariables>;
export const DeleteBudgetLineItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBudgetLineItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBudgetLineItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<DeleteBudgetLineItemMutation, DeleteBudgetLineItemMutationVariables>;