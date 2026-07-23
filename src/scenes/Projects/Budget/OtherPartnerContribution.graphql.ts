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

export type OtherPartnerContributionFragment = { readonly __typename: 'OtherPartnerContribution' }
  & Pick<Types.OtherPartnerContribution, 'id' | 'createdAt' | 'canDelete'>
  & {
    readonly donor: { readonly __typename?: 'SecuredOrganizationNullable' }
      & Pick<Types.SecuredOrganizationNullable, 'canRead' | 'canEdit'>
      & { readonly value?: Types.Maybe<SecuredOrganizationValueFragment> };
    readonly description: { readonly __typename?: 'SecuredStringNullable' }
      & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>;
    readonly fiscalYearAmounts: { readonly __typename?: 'SecuredFiscalYearAmounts' }
      & Pick<Types.SecuredFiscalYearAmounts, 'canRead' | 'canEdit' | 'value'>;
  };

export const OtherPartnerContributionFragmentDoc = gql`
  fragment OtherPartnerContribution on OtherPartnerContribution {
    id
    createdAt
    canDelete
    donor {
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
    description {
      canRead
      canEdit
      value
    }
    fiscalYearAmounts {
      canRead
      canEdit
      value
    }
  }
` as unknown as DocumentNode<OtherPartnerContributionFragment, unknown>;

export type CreateOtherPartnerContributionMutationVariables = Types.Exact<{
  input: Types.CreateOtherPartnerContribution;
}>;

export type CreateOtherPartnerContributionMutation = {
  readonly createOtherPartnerContribution: { readonly __typename?: 'OtherPartnerContributionCreated' }
    & { readonly otherPartnerContribution: OtherPartnerContributionFragment };
};

export const CreateOtherPartnerContributionDocument = gql`
  mutation CreateOtherPartnerContribution($input: CreateOtherPartnerContribution!) {
    createOtherPartnerContribution(input: $input) {
      otherPartnerContribution {
        ...OtherPartnerContribution
      }
    }
  }
  ${OtherPartnerContributionFragmentDoc}
` as unknown as DocumentNode<
  CreateOtherPartnerContributionMutation,
  CreateOtherPartnerContributionMutationVariables
>;

export type UpdateOtherPartnerContributionMutationVariables = Types.Exact<{
  input: Types.UpdateOtherPartnerContribution;
}>;

export type UpdateOtherPartnerContributionMutation = {
  readonly updateOtherPartnerContribution: { readonly __typename?: 'OtherPartnerContributionUpdated' }
    & { readonly otherPartnerContribution: OtherPartnerContributionFragment };
};

export const UpdateOtherPartnerContributionDocument = gql`
  mutation UpdateOtherPartnerContribution($input: UpdateOtherPartnerContribution!) {
    updateOtherPartnerContribution(input: $input) {
      otherPartnerContribution {
        ...OtherPartnerContribution
      }
    }
  }
  ${OtherPartnerContributionFragmentDoc}
` as unknown as DocumentNode<
  UpdateOtherPartnerContributionMutation,
  UpdateOtherPartnerContributionMutationVariables
>;

export type DeleteOtherPartnerContributionMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;

export type DeleteOtherPartnerContributionMutation = {
  readonly deleteOtherPartnerContribution: { readonly __typename: 'OtherPartnerContributionDeleted' };
};

export const DeleteOtherPartnerContributionDocument = gql`
  mutation DeleteOtherPartnerContribution($id: ID!) {
    deleteOtherPartnerContribution(id: $id) {
      __typename
    }
  }
` as unknown as DocumentNode<
  DeleteOtherPartnerContributionMutation,
  DeleteOtherPartnerContributionMutationVariables
>;
