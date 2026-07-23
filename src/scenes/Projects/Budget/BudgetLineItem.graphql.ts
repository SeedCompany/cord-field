/**
 * HAND-WRITTEN, see BudgetReferenceCountry.graphql.ts's header comment for
 * why (no live backend reachable to run real codegen) and the conventions
 * followed.
 */
import { gql } from '@apollo/client';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import type * as Types from '~/api/schema.graphql';

type SecuredOrganizationValueFragment = { readonly __typename?: 'Organization' }
  & Pick<Types.Organization, 'id' | 'createdAt'>
  & {
    readonly name: { readonly __typename?: 'SecuredString' }
      & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>;
  };

export type BudgetLineItemFragment = { readonly __typename: 'BudgetLineItem' }
  & Pick<Types.BudgetLineItem, 'id' | 'createdAt' | 'canDelete'>
  & {
    readonly account: { readonly __typename?: 'SecuredString' }
      & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>;
    readonly description: { readonly __typename?: 'SecuredStringNullable' }
      & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>;
    readonly costType: { readonly __typename?: 'SecuredString' }
      & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>;
    readonly budgetCategory: { readonly __typename?: 'SecuredString' }
      & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>;
    readonly activity: { readonly __typename?: 'SecuredStringNullable' }
      & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>;
    readonly serviceProvider: { readonly __typename?: 'SecuredOrganizationNullable' }
      & Pick<Types.SecuredOrganizationNullable, 'canRead' | 'canEdit'>
      & { readonly value?: Types.Maybe<SecuredOrganizationValueFragment> };
    readonly funder: { readonly __typename?: 'SecuredOrganizationNullable' }
      & Pick<Types.SecuredOrganizationNullable, 'canRead' | 'canEdit'>
      & { readonly value?: Types.Maybe<SecuredOrganizationValueFragment> };
    readonly fiscalYearAmounts: { readonly __typename?: 'SecuredFiscalYearAmounts' }
      & Pick<Types.SecuredFiscalYearAmounts, 'canRead' | 'canEdit' | 'value'>;
  };

export const BudgetLineItemFragmentDoc = gql`
  fragment BudgetLineItem on BudgetLineItem {
    id
    createdAt
    canDelete
    account {
      canRead
      canEdit
      value
    }
    description {
      canRead
      canEdit
      value
    }
    costType {
      canRead
      canEdit
      value
    }
    budgetCategory {
      canRead
      canEdit
      value
    }
    activity {
      canRead
      canEdit
      value
    }
    serviceProvider {
      canRead
      canEdit
      value {
        id
        createdAt
        name {
          canRead
          canEdit
          value
        }
      }
    }
    funder {
      canRead
      canEdit
      value {
        id
        createdAt
        name {
          canRead
          canEdit
          value
        }
      }
    }
    fiscalYearAmounts {
      canRead
      canEdit
      value
    }
  }
` as unknown as DocumentNode<BudgetLineItemFragment, unknown>;

export type CreateBudgetLineItemMutationVariables = Types.Exact<{
  input: Types.CreateBudgetLineItem;
}>;

export type CreateBudgetLineItemMutation = {
  readonly createBudgetLineItem: { readonly __typename?: 'BudgetLineItemCreated' }
    & { readonly budgetLineItem: BudgetLineItemFragment };
};

export const CreateBudgetLineItemDocument = gql`
  mutation CreateBudgetLineItem($input: CreateBudgetLineItem!) {
    createBudgetLineItem(input: $input) {
      budgetLineItem {
        ...BudgetLineItem
      }
    }
  }
  ${BudgetLineItemFragmentDoc}
` as unknown as DocumentNode<
  CreateBudgetLineItemMutation,
  CreateBudgetLineItemMutationVariables
>;

export type UpdateBudgetLineItemMutationVariables = Types.Exact<{
  input: Types.UpdateBudgetLineItem;
}>;

export type UpdateBudgetLineItemMutation = {
  readonly updateBudgetLineItem: { readonly __typename?: 'BudgetLineItemUpdated' }
    & { readonly budgetLineItem: BudgetLineItemFragment };
};

export const UpdateBudgetLineItemDocument = gql`
  mutation UpdateBudgetLineItem($input: UpdateBudgetLineItem!) {
    updateBudgetLineItem(input: $input) {
      budgetLineItem {
        ...BudgetLineItem
      }
    }
  }
  ${BudgetLineItemFragmentDoc}
` as unknown as DocumentNode<
  UpdateBudgetLineItemMutation,
  UpdateBudgetLineItemMutationVariables
>;

export type DeleteBudgetLineItemMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;

export type DeleteBudgetLineItemMutation = {
  readonly deleteBudgetLineItem: { readonly __typename: 'BudgetLineItemDeleted' };
};

export const DeleteBudgetLineItemDocument = gql`
  mutation DeleteBudgetLineItem($id: ID!) {
    deleteBudgetLineItem(id: $id) {
      __typename
    }
  }
` as unknown as DocumentNode<
  DeleteBudgetLineItemMutation,
  DeleteBudgetLineItemMutationVariables
>;
