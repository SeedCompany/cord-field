import type * as Types from '~/api/schema.graphql';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type OtherPartnerContributionFragment = (
  { readonly __typename?: 'OtherPartnerContribution' }
  & Pick<Types.OtherPartnerContribution, 'id' | 'createdAt' | 'canDelete'>
  & { readonly donor: (
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
  ), readonly description: (
    { readonly __typename?: 'SecuredStringNullable' }
    & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>
  ), readonly fiscalYearAmounts: (
    { readonly __typename?: 'SecuredFiscalYearAmounts' }
    & Pick<Types.SecuredFiscalYearAmounts, 'canRead' | 'canEdit' | 'value'>
  ) }
);

export type CreateOtherPartnerContributionMutationVariables = Types.Exact<{
  input: Types.CreateOtherPartnerContribution;
}>;


export type CreateOtherPartnerContributionMutation = { readonly createOtherPartnerContribution: (
    { readonly __typename?: 'OtherPartnerContributionCreated' }
    & { readonly otherPartnerContribution: (
      { readonly __typename?: 'OtherPartnerContribution' }
      & Pick<Types.OtherPartnerContribution, 'id' | 'createdAt' | 'canDelete'>
      & { readonly donor: (
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
      ), readonly description: (
        { readonly __typename?: 'SecuredStringNullable' }
        & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>
      ), readonly fiscalYearAmounts: (
        { readonly __typename?: 'SecuredFiscalYearAmounts' }
        & Pick<Types.SecuredFiscalYearAmounts, 'canRead' | 'canEdit' | 'value'>
      ) }
    ) }
  ) };

export type UpdateOtherPartnerContributionMutationVariables = Types.Exact<{
  input: Types.UpdateOtherPartnerContribution;
}>;


export type UpdateOtherPartnerContributionMutation = { readonly updateOtherPartnerContribution: (
    { readonly __typename?: 'OtherPartnerContributionUpdated' }
    & { readonly otherPartnerContribution: (
      { readonly __typename?: 'OtherPartnerContribution' }
      & Pick<Types.OtherPartnerContribution, 'id' | 'createdAt' | 'canDelete'>
      & { readonly donor: (
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
      ), readonly description: (
        { readonly __typename?: 'SecuredStringNullable' }
        & Pick<Types.SecuredStringNullable, 'canRead' | 'canEdit' | 'value'>
      ), readonly fiscalYearAmounts: (
        { readonly __typename?: 'SecuredFiscalYearAmounts' }
        & Pick<Types.SecuredFiscalYearAmounts, 'canRead' | 'canEdit' | 'value'>
      ) }
    ) }
  ) };

export type DeleteOtherPartnerContributionMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DeleteOtherPartnerContributionMutation = { readonly deleteOtherPartnerContribution: { readonly __typename: 'OtherPartnerContributionDeleted' } };

export const OtherPartnerContributionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OtherPartnerContribution"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OtherPartnerContribution"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"donor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fiscalYearAmounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<OtherPartnerContributionFragment, unknown>;
export const CreateOtherPartnerContributionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOtherPartnerContribution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOtherPartnerContribution"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOtherPartnerContribution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"otherPartnerContribution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OtherPartnerContribution"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OtherPartnerContribution"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OtherPartnerContribution"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"donor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fiscalYearAmounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<CreateOtherPartnerContributionMutation, CreateOtherPartnerContributionMutationVariables>;
export const UpdateOtherPartnerContributionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOtherPartnerContribution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOtherPartnerContribution"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOtherPartnerContribution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"otherPartnerContribution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OtherPartnerContribution"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OtherPartnerContribution"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OtherPartnerContribution"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"donor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fiscalYearAmounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<UpdateOtherPartnerContributionMutation, UpdateOtherPartnerContributionMutationVariables>;
export const DeleteOtherPartnerContributionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOtherPartnerContribution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteOtherPartnerContribution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<DeleteOtherPartnerContributionMutation, DeleteOtherPartnerContributionMutationVariables>;