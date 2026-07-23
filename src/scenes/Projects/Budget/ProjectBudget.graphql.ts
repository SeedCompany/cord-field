import type * as Types from '~/api/schema.graphql';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type BudgetRecordFragment = (
  { readonly __typename: 'BudgetRecord' }
  & Pick<Types.BudgetRecord, 'createdAt' | 'id'>
  & { readonly amount: (
    { readonly __typename?: 'SecuredFloatNullable' }
    & Pick<Types.SecuredFloatNullable, 'canEdit' | 'canRead' | 'value'>
  ), readonly preApprovedAmount: (
    { readonly __typename?: 'SecuredFloatNullable' }
    & Pick<Types.SecuredFloatNullable, 'value' | 'canEdit' | 'canRead'>
  ), readonly initialAmount: (
    { readonly __typename?: 'SecuredFloatNullable' }
    & Pick<Types.SecuredFloatNullable, 'value' | 'canEdit' | 'canRead'>
  ), readonly fiscalYear: (
    { readonly __typename?: 'SecuredInt' }
    & Pick<Types.SecuredInt, 'canEdit' | 'canRead' | 'value'>
  ), readonly organization: (
    { readonly __typename?: 'SecuredOrganization' }
    & Pick<Types.SecuredOrganization, 'canEdit' | 'canRead'>
    & { readonly value?: Types.Maybe<(
      { readonly __typename?: 'Organization' }
      & Pick<Types.Organization, 'id' | 'createdAt'>
      & { readonly name: (
        { readonly __typename?: 'SecuredString' }
        & Pick<Types.SecuredString, 'canEdit' | 'canRead' | 'value'>
      ) }
    )> }
  ), readonly changeset?: Types.Maybe<(
    { readonly __typename?: 'ProjectChangeRequest' }
    & Pick<Types.ProjectChangeRequest, 'id'>
  )> }
);

export type ProjectBudgetQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  changeset?: Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type ProjectBudgetQuery = { readonly project: (
    { readonly __typename: 'InternshipProject' }
    & Pick<Types.InternshipProject, 'id' | 'sensitivity'>
    & { readonly name: (
      { readonly __typename?: 'SecuredString' }
      & Pick<Types.SecuredString, 'canRead' | 'value'>
    ), readonly mouStart: (
      { readonly __typename?: 'SecuredDateNullable' }
      & Pick<Types.SecuredDateNullable, 'value'>
    ), readonly mouEnd: (
      { readonly __typename?: 'SecuredDateNullable' }
      & Pick<Types.SecuredDateNullable, 'value'>
    ), readonly partnerships: (
      { readonly __typename?: 'SecuredPartnershipList' }
      & { readonly items: ReadonlyArray<(
        { readonly __typename?: 'Partnership' }
        & { readonly partner: (
          { readonly __typename?: 'SecuredPartner' }
          & { readonly value?: Types.Maybe<(
            { readonly __typename?: 'Partner' }
            & { readonly organization: (
              { readonly __typename?: 'SecuredOrganization' }
              & { readonly value?: Types.Maybe<(
                { readonly __typename?: 'Organization' }
                & Pick<Types.Organization, 'id'>
                & { readonly name: (
                  { readonly __typename?: 'SecuredString' }
                  & Pick<Types.SecuredString, 'value'>
                ) }
              )> }
            ) }
          )> }
        ) }
      )> }
    ), readonly primaryPartnership: (
      { readonly __typename?: 'SecuredPartnership' }
      & { readonly value?: Types.Maybe<(
        { readonly __typename?: 'Partnership' }
        & { readonly partner: (
          { readonly __typename?: 'SecuredPartner' }
          & { readonly value?: Types.Maybe<(
            { readonly __typename?: 'Partner' }
            & { readonly organization: (
              { readonly __typename?: 'SecuredOrganization' }
              & { readonly value?: Types.Maybe<(
                { readonly __typename?: 'Organization' }
                & Pick<Types.Organization, 'id'>
                & { readonly name: (
                  { readonly __typename?: 'SecuredString' }
                  & Pick<Types.SecuredString, 'value'>
                ) }
              )> }
            ) }
          )> }
        ) }
      )> }
    ), readonly budget: (
      { readonly __typename?: 'SecuredBudget' }
      & Pick<Types.SecuredBudget, 'canRead' | 'canEdit'>
      & { readonly value?: Types.Maybe<(
        { readonly __typename: 'Budget' }
        & Pick<Types.Budget, 'status' | 'createdAt' | 'total' | 'id'>
        & { readonly records: ReadonlyArray<(
          { readonly __typename: 'BudgetRecord' }
          & Pick<Types.BudgetRecord, 'createdAt' | 'id'>
          & { readonly amount: (
            { readonly __typename?: 'SecuredFloatNullable' }
            & Pick<Types.SecuredFloatNullable, 'canEdit' | 'canRead' | 'value'>
          ), readonly preApprovedAmount: (
            { readonly __typename?: 'SecuredFloatNullable' }
            & Pick<Types.SecuredFloatNullable, 'value' | 'canEdit' | 'canRead'>
          ), readonly initialAmount: (
            { readonly __typename?: 'SecuredFloatNullable' }
            & Pick<Types.SecuredFloatNullable, 'value' | 'canEdit' | 'canRead'>
          ), readonly fiscalYear: (
            { readonly __typename?: 'SecuredInt' }
            & Pick<Types.SecuredInt, 'canEdit' | 'canRead' | 'value'>
          ), readonly organization: (
            { readonly __typename?: 'SecuredOrganization' }
            & Pick<Types.SecuredOrganization, 'canEdit' | 'canRead'>
            & { readonly value?: Types.Maybe<(
              { readonly __typename?: 'Organization' }
              & Pick<Types.Organization, 'id' | 'createdAt'>
              & { readonly name: (
                { readonly __typename?: 'SecuredString' }
                & Pick<Types.SecuredString, 'canEdit' | 'canRead' | 'value'>
              ) }
            )> }
          ), readonly changeset?: Types.Maybe<(
            { readonly __typename?: 'ProjectChangeRequest' }
            & Pick<Types.ProjectChangeRequest, 'id'>
          )> }
        )>, readonly universalTemplateFile: (
          { readonly __typename?: 'SecuredFile' }
          & Pick<Types.SecuredFile, 'canEdit' | 'canRead'>
          & { readonly value?: Types.Maybe<(
            { readonly __typename?: 'File' }
            & Pick<Types.File, 'id' | 'name' | 'type' | 'createdAt' | 'mimeType' | 'size' | 'modifiedAt' | 'url'>
            & { readonly createdBy: (
              { readonly __typename?: 'User' }
              & Pick<Types.User, 'id' | 'fullName'>
            ), readonly modifiedBy: (
              { readonly __typename?: 'User' }
              & Pick<Types.User, 'id' | 'fullName'>
            ) }
          )> }
        ), readonly country: (
          { readonly __typename?: 'SecuredBudgetReferenceCountry' }
          & Pick<Types.SecuredBudgetReferenceCountry, 'canRead' | 'canEdit'>
          & { readonly value?: Types.Maybe<(
            { readonly __typename?: 'BudgetReferenceCountry' }
            & Pick<Types.BudgetReferenceCountry, 'id' | 'name' | 'region' | 'keystoneCountryName' | 'currencyCode' | 'costOfLivingIndex' | 'indexMethodology' | 'adminFeeCap'>
          )> }
        ), readonly entryCurrencyMode: (
          { readonly __typename?: 'SecuredString' }
          & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
        ), readonly displayCurrencyMode: (
          { readonly __typename?: 'SecuredString' }
          & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
        ), readonly exchangeRate: (
          { readonly __typename?: 'SecuredFloat' }
          & Pick<Types.SecuredFloat, 'canRead' | 'canEdit' | 'value'>
        ), readonly inflationRate: (
          { readonly __typename?: 'SecuredFloat' }
          & Pick<Types.SecuredFloat, 'canRead' | 'canEdit' | 'value'>
        ), readonly adminFeePercent: (
          { readonly __typename?: 'SecuredFloat' }
          & Pick<Types.SecuredFloat, 'canRead' | 'canEdit' | 'value'>
        ), readonly languageCount: (
          { readonly __typename?: 'SecuredInt' }
          & Pick<Types.SecuredInt, 'canRead' | 'canEdit' | 'value'>
        ), readonly lineItems: ReadonlyArray<(
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
        )>, readonly otherPartnerContributions: ReadonlyArray<(
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
        )>, readonly calculationSummary?: Types.Maybe<(
          { readonly __typename?: 'BudgetCalculationSummary' }
          & Pick<Types.BudgetCalculationSummary, 'bibleTranslationPercent' | 'funderBibleTranslationPercent' | 'costPerLanguage' | 'capped'>
          & { readonly totals: (
            { readonly __typename?: 'BudgetCalculationTotals' }
            & Pick<Types.BudgetCalculationTotals, 'cash' | 'inKind' | 'admin' | 'grandTotal' | 'totalCash' | 'otherPartnerContributions' | 'netToFunder' | 'adminFeeCap'>
          ), readonly fiscalYears: ReadonlyArray<(
            { readonly __typename?: 'BudgetCalculationFiscalYear' }
            & Pick<Types.BudgetCalculationFiscalYear, 'fiscalYear' | 'label' | 'cash' | 'inKind' | 'admin' | 'grandTotal' | 'totalCash' | 'otherPartnerContributions' | 'netToFunder' | 'adminFeeCap'>
          )> }
        )>, readonly summary: (
          { readonly __typename?: 'BudgetSummary' }
          & Pick<Types.BudgetSummary, 'hasPreApproved' | 'preApprovedExceeded'>
        ), readonly project: (
          { readonly __typename?: 'InternshipProject' }
          & Pick<Types.InternshipProject, 'id' | 'type'>
        ) | (
          { readonly __typename?: 'MomentumTranslationProject' }
          & Pick<Types.MomentumTranslationProject, 'id' | 'type'>
        ) | (
          { readonly __typename?: 'MultiplicationTranslationProject' }
          & Pick<Types.MultiplicationTranslationProject, 'id' | 'type'>
        ), readonly changeset?: Types.Maybe<(
          { readonly __typename?: 'ProjectChangeRequest' }
          & Pick<Types.ProjectChangeRequest, 'id'>
        )> }
      )> }
    ), readonly changeset?: Types.Maybe<(
      { readonly __typename?: 'ProjectChangeRequest' }
      & Pick<Types.ProjectChangeRequest, 'id'>
    )> }
  ) | (
    { readonly __typename: 'MomentumTranslationProject' }
    & Pick<Types.MomentumTranslationProject, 'id' | 'sensitivity'>
    & { readonly name: (
      { readonly __typename?: 'SecuredString' }
      & Pick<Types.SecuredString, 'canRead' | 'value'>
    ), readonly mouStart: (
      { readonly __typename?: 'SecuredDateNullable' }
      & Pick<Types.SecuredDateNullable, 'value'>
    ), readonly mouEnd: (
      { readonly __typename?: 'SecuredDateNullable' }
      & Pick<Types.SecuredDateNullable, 'value'>
    ), readonly partnerships: (
      { readonly __typename?: 'SecuredPartnershipList' }
      & { readonly items: ReadonlyArray<(
        { readonly __typename?: 'Partnership' }
        & { readonly partner: (
          { readonly __typename?: 'SecuredPartner' }
          & { readonly value?: Types.Maybe<(
            { readonly __typename?: 'Partner' }
            & { readonly organization: (
              { readonly __typename?: 'SecuredOrganization' }
              & { readonly value?: Types.Maybe<(
                { readonly __typename?: 'Organization' }
                & Pick<Types.Organization, 'id'>
                & { readonly name: (
                  { readonly __typename?: 'SecuredString' }
                  & Pick<Types.SecuredString, 'value'>
                ) }
              )> }
            ) }
          )> }
        ) }
      )> }
    ), readonly primaryPartnership: (
      { readonly __typename?: 'SecuredPartnership' }
      & { readonly value?: Types.Maybe<(
        { readonly __typename?: 'Partnership' }
        & { readonly partner: (
          { readonly __typename?: 'SecuredPartner' }
          & { readonly value?: Types.Maybe<(
            { readonly __typename?: 'Partner' }
            & { readonly organization: (
              { readonly __typename?: 'SecuredOrganization' }
              & { readonly value?: Types.Maybe<(
                { readonly __typename?: 'Organization' }
                & Pick<Types.Organization, 'id'>
                & { readonly name: (
                  { readonly __typename?: 'SecuredString' }
                  & Pick<Types.SecuredString, 'value'>
                ) }
              )> }
            ) }
          )> }
        ) }
      )> }
    ), readonly budget: (
      { readonly __typename?: 'SecuredBudget' }
      & Pick<Types.SecuredBudget, 'canRead' | 'canEdit'>
      & { readonly value?: Types.Maybe<(
        { readonly __typename: 'Budget' }
        & Pick<Types.Budget, 'status' | 'createdAt' | 'total' | 'id'>
        & { readonly records: ReadonlyArray<(
          { readonly __typename: 'BudgetRecord' }
          & Pick<Types.BudgetRecord, 'createdAt' | 'id'>
          & { readonly amount: (
            { readonly __typename?: 'SecuredFloatNullable' }
            & Pick<Types.SecuredFloatNullable, 'canEdit' | 'canRead' | 'value'>
          ), readonly preApprovedAmount: (
            { readonly __typename?: 'SecuredFloatNullable' }
            & Pick<Types.SecuredFloatNullable, 'value' | 'canEdit' | 'canRead'>
          ), readonly initialAmount: (
            { readonly __typename?: 'SecuredFloatNullable' }
            & Pick<Types.SecuredFloatNullable, 'value' | 'canEdit' | 'canRead'>
          ), readonly fiscalYear: (
            { readonly __typename?: 'SecuredInt' }
            & Pick<Types.SecuredInt, 'canEdit' | 'canRead' | 'value'>
          ), readonly organization: (
            { readonly __typename?: 'SecuredOrganization' }
            & Pick<Types.SecuredOrganization, 'canEdit' | 'canRead'>
            & { readonly value?: Types.Maybe<(
              { readonly __typename?: 'Organization' }
              & Pick<Types.Organization, 'id' | 'createdAt'>
              & { readonly name: (
                { readonly __typename?: 'SecuredString' }
                & Pick<Types.SecuredString, 'canEdit' | 'canRead' | 'value'>
              ) }
            )> }
          ), readonly changeset?: Types.Maybe<(
            { readonly __typename?: 'ProjectChangeRequest' }
            & Pick<Types.ProjectChangeRequest, 'id'>
          )> }
        )>, readonly universalTemplateFile: (
          { readonly __typename?: 'SecuredFile' }
          & Pick<Types.SecuredFile, 'canEdit' | 'canRead'>
          & { readonly value?: Types.Maybe<(
            { readonly __typename?: 'File' }
            & Pick<Types.File, 'id' | 'name' | 'type' | 'createdAt' | 'mimeType' | 'size' | 'modifiedAt' | 'url'>
            & { readonly createdBy: (
              { readonly __typename?: 'User' }
              & Pick<Types.User, 'id' | 'fullName'>
            ), readonly modifiedBy: (
              { readonly __typename?: 'User' }
              & Pick<Types.User, 'id' | 'fullName'>
            ) }
          )> }
        ), readonly country: (
          { readonly __typename?: 'SecuredBudgetReferenceCountry' }
          & Pick<Types.SecuredBudgetReferenceCountry, 'canRead' | 'canEdit'>
          & { readonly value?: Types.Maybe<(
            { readonly __typename?: 'BudgetReferenceCountry' }
            & Pick<Types.BudgetReferenceCountry, 'id' | 'name' | 'region' | 'keystoneCountryName' | 'currencyCode' | 'costOfLivingIndex' | 'indexMethodology' | 'adminFeeCap'>
          )> }
        ), readonly entryCurrencyMode: (
          { readonly __typename?: 'SecuredString' }
          & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
        ), readonly displayCurrencyMode: (
          { readonly __typename?: 'SecuredString' }
          & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
        ), readonly exchangeRate: (
          { readonly __typename?: 'SecuredFloat' }
          & Pick<Types.SecuredFloat, 'canRead' | 'canEdit' | 'value'>
        ), readonly inflationRate: (
          { readonly __typename?: 'SecuredFloat' }
          & Pick<Types.SecuredFloat, 'canRead' | 'canEdit' | 'value'>
        ), readonly adminFeePercent: (
          { readonly __typename?: 'SecuredFloat' }
          & Pick<Types.SecuredFloat, 'canRead' | 'canEdit' | 'value'>
        ), readonly languageCount: (
          { readonly __typename?: 'SecuredInt' }
          & Pick<Types.SecuredInt, 'canRead' | 'canEdit' | 'value'>
        ), readonly lineItems: ReadonlyArray<(
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
        )>, readonly otherPartnerContributions: ReadonlyArray<(
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
        )>, readonly calculationSummary?: Types.Maybe<(
          { readonly __typename?: 'BudgetCalculationSummary' }
          & Pick<Types.BudgetCalculationSummary, 'bibleTranslationPercent' | 'funderBibleTranslationPercent' | 'costPerLanguage' | 'capped'>
          & { readonly totals: (
            { readonly __typename?: 'BudgetCalculationTotals' }
            & Pick<Types.BudgetCalculationTotals, 'cash' | 'inKind' | 'admin' | 'grandTotal' | 'totalCash' | 'otherPartnerContributions' | 'netToFunder' | 'adminFeeCap'>
          ), readonly fiscalYears: ReadonlyArray<(
            { readonly __typename?: 'BudgetCalculationFiscalYear' }
            & Pick<Types.BudgetCalculationFiscalYear, 'fiscalYear' | 'label' | 'cash' | 'inKind' | 'admin' | 'grandTotal' | 'totalCash' | 'otherPartnerContributions' | 'netToFunder' | 'adminFeeCap'>
          )> }
        )>, readonly summary: (
          { readonly __typename?: 'BudgetSummary' }
          & Pick<Types.BudgetSummary, 'hasPreApproved' | 'preApprovedExceeded'>
        ), readonly project: (
          { readonly __typename?: 'InternshipProject' }
          & Pick<Types.InternshipProject, 'id' | 'type'>
        ) | (
          { readonly __typename?: 'MomentumTranslationProject' }
          & Pick<Types.MomentumTranslationProject, 'id' | 'type'>
        ) | (
          { readonly __typename?: 'MultiplicationTranslationProject' }
          & Pick<Types.MultiplicationTranslationProject, 'id' | 'type'>
        ), readonly changeset?: Types.Maybe<(
          { readonly __typename?: 'ProjectChangeRequest' }
          & Pick<Types.ProjectChangeRequest, 'id'>
        )> }
      )> }
    ), readonly changeset?: Types.Maybe<(
      { readonly __typename?: 'ProjectChangeRequest' }
      & Pick<Types.ProjectChangeRequest, 'id'>
    )> }
  ) | (
    { readonly __typename: 'MultiplicationTranslationProject' }
    & Pick<Types.MultiplicationTranslationProject, 'id' | 'sensitivity'>
    & { readonly name: (
      { readonly __typename?: 'SecuredString' }
      & Pick<Types.SecuredString, 'canRead' | 'value'>
    ), readonly mouStart: (
      { readonly __typename?: 'SecuredDateNullable' }
      & Pick<Types.SecuredDateNullable, 'value'>
    ), readonly mouEnd: (
      { readonly __typename?: 'SecuredDateNullable' }
      & Pick<Types.SecuredDateNullable, 'value'>
    ), readonly partnerships: (
      { readonly __typename?: 'SecuredPartnershipList' }
      & { readonly items: ReadonlyArray<(
        { readonly __typename?: 'Partnership' }
        & { readonly partner: (
          { readonly __typename?: 'SecuredPartner' }
          & { readonly value?: Types.Maybe<(
            { readonly __typename?: 'Partner' }
            & { readonly organization: (
              { readonly __typename?: 'SecuredOrganization' }
              & { readonly value?: Types.Maybe<(
                { readonly __typename?: 'Organization' }
                & Pick<Types.Organization, 'id'>
                & { readonly name: (
                  { readonly __typename?: 'SecuredString' }
                  & Pick<Types.SecuredString, 'value'>
                ) }
              )> }
            ) }
          )> }
        ) }
      )> }
    ), readonly primaryPartnership: (
      { readonly __typename?: 'SecuredPartnership' }
      & { readonly value?: Types.Maybe<(
        { readonly __typename?: 'Partnership' }
        & { readonly partner: (
          { readonly __typename?: 'SecuredPartner' }
          & { readonly value?: Types.Maybe<(
            { readonly __typename?: 'Partner' }
            & { readonly organization: (
              { readonly __typename?: 'SecuredOrganization' }
              & { readonly value?: Types.Maybe<(
                { readonly __typename?: 'Organization' }
                & Pick<Types.Organization, 'id'>
                & { readonly name: (
                  { readonly __typename?: 'SecuredString' }
                  & Pick<Types.SecuredString, 'value'>
                ) }
              )> }
            ) }
          )> }
        ) }
      )> }
    ), readonly budget: (
      { readonly __typename?: 'SecuredBudget' }
      & Pick<Types.SecuredBudget, 'canRead' | 'canEdit'>
      & { readonly value?: Types.Maybe<(
        { readonly __typename: 'Budget' }
        & Pick<Types.Budget, 'status' | 'createdAt' | 'total' | 'id'>
        & { readonly records: ReadonlyArray<(
          { readonly __typename: 'BudgetRecord' }
          & Pick<Types.BudgetRecord, 'createdAt' | 'id'>
          & { readonly amount: (
            { readonly __typename?: 'SecuredFloatNullable' }
            & Pick<Types.SecuredFloatNullable, 'canEdit' | 'canRead' | 'value'>
          ), readonly preApprovedAmount: (
            { readonly __typename?: 'SecuredFloatNullable' }
            & Pick<Types.SecuredFloatNullable, 'value' | 'canEdit' | 'canRead'>
          ), readonly initialAmount: (
            { readonly __typename?: 'SecuredFloatNullable' }
            & Pick<Types.SecuredFloatNullable, 'value' | 'canEdit' | 'canRead'>
          ), readonly fiscalYear: (
            { readonly __typename?: 'SecuredInt' }
            & Pick<Types.SecuredInt, 'canEdit' | 'canRead' | 'value'>
          ), readonly organization: (
            { readonly __typename?: 'SecuredOrganization' }
            & Pick<Types.SecuredOrganization, 'canEdit' | 'canRead'>
            & { readonly value?: Types.Maybe<(
              { readonly __typename?: 'Organization' }
              & Pick<Types.Organization, 'id' | 'createdAt'>
              & { readonly name: (
                { readonly __typename?: 'SecuredString' }
                & Pick<Types.SecuredString, 'canEdit' | 'canRead' | 'value'>
              ) }
            )> }
          ), readonly changeset?: Types.Maybe<(
            { readonly __typename?: 'ProjectChangeRequest' }
            & Pick<Types.ProjectChangeRequest, 'id'>
          )> }
        )>, readonly universalTemplateFile: (
          { readonly __typename?: 'SecuredFile' }
          & Pick<Types.SecuredFile, 'canEdit' | 'canRead'>
          & { readonly value?: Types.Maybe<(
            { readonly __typename?: 'File' }
            & Pick<Types.File, 'id' | 'name' | 'type' | 'createdAt' | 'mimeType' | 'size' | 'modifiedAt' | 'url'>
            & { readonly createdBy: (
              { readonly __typename?: 'User' }
              & Pick<Types.User, 'id' | 'fullName'>
            ), readonly modifiedBy: (
              { readonly __typename?: 'User' }
              & Pick<Types.User, 'id' | 'fullName'>
            ) }
          )> }
        ), readonly country: (
          { readonly __typename?: 'SecuredBudgetReferenceCountry' }
          & Pick<Types.SecuredBudgetReferenceCountry, 'canRead' | 'canEdit'>
          & { readonly value?: Types.Maybe<(
            { readonly __typename?: 'BudgetReferenceCountry' }
            & Pick<Types.BudgetReferenceCountry, 'id' | 'name' | 'region' | 'keystoneCountryName' | 'currencyCode' | 'costOfLivingIndex' | 'indexMethodology' | 'adminFeeCap'>
          )> }
        ), readonly entryCurrencyMode: (
          { readonly __typename?: 'SecuredString' }
          & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
        ), readonly displayCurrencyMode: (
          { readonly __typename?: 'SecuredString' }
          & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
        ), readonly exchangeRate: (
          { readonly __typename?: 'SecuredFloat' }
          & Pick<Types.SecuredFloat, 'canRead' | 'canEdit' | 'value'>
        ), readonly inflationRate: (
          { readonly __typename?: 'SecuredFloat' }
          & Pick<Types.SecuredFloat, 'canRead' | 'canEdit' | 'value'>
        ), readonly adminFeePercent: (
          { readonly __typename?: 'SecuredFloat' }
          & Pick<Types.SecuredFloat, 'canRead' | 'canEdit' | 'value'>
        ), readonly languageCount: (
          { readonly __typename?: 'SecuredInt' }
          & Pick<Types.SecuredInt, 'canRead' | 'canEdit' | 'value'>
        ), readonly lineItems: ReadonlyArray<(
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
        )>, readonly otherPartnerContributions: ReadonlyArray<(
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
        )>, readonly calculationSummary?: Types.Maybe<(
          { readonly __typename?: 'BudgetCalculationSummary' }
          & Pick<Types.BudgetCalculationSummary, 'bibleTranslationPercent' | 'funderBibleTranslationPercent' | 'costPerLanguage' | 'capped'>
          & { readonly totals: (
            { readonly __typename?: 'BudgetCalculationTotals' }
            & Pick<Types.BudgetCalculationTotals, 'cash' | 'inKind' | 'admin' | 'grandTotal' | 'totalCash' | 'otherPartnerContributions' | 'netToFunder' | 'adminFeeCap'>
          ), readonly fiscalYears: ReadonlyArray<(
            { readonly __typename?: 'BudgetCalculationFiscalYear' }
            & Pick<Types.BudgetCalculationFiscalYear, 'fiscalYear' | 'label' | 'cash' | 'inKind' | 'admin' | 'grandTotal' | 'totalCash' | 'otherPartnerContributions' | 'netToFunder' | 'adminFeeCap'>
          )> }
        )>, readonly summary: (
          { readonly __typename?: 'BudgetSummary' }
          & Pick<Types.BudgetSummary, 'hasPreApproved' | 'preApprovedExceeded'>
        ), readonly project: (
          { readonly __typename?: 'InternshipProject' }
          & Pick<Types.InternshipProject, 'id' | 'type'>
        ) | (
          { readonly __typename?: 'MomentumTranslationProject' }
          & Pick<Types.MomentumTranslationProject, 'id' | 'type'>
        ) | (
          { readonly __typename?: 'MultiplicationTranslationProject' }
          & Pick<Types.MultiplicationTranslationProject, 'id' | 'type'>
        ), readonly changeset?: Types.Maybe<(
          { readonly __typename?: 'ProjectChangeRequest' }
          & Pick<Types.ProjectChangeRequest, 'id'>
        )> }
      )> }
    ), readonly changeset?: Types.Maybe<(
      { readonly __typename?: 'ProjectChangeRequest' }
      & Pick<Types.ProjectChangeRequest, 'id'>
    )> }
  ) };

export type UpdateBudgetAssumptionsMutationVariables = Types.Exact<{
  input: Types.UpdateBudget;
}>;


export type UpdateBudgetAssumptionsMutation = { readonly updateBudget: (
    { readonly __typename?: 'BudgetUpdated' }
    & { readonly budget: (
      { readonly __typename: 'Budget' }
      & Pick<Types.Budget, 'id'>
      & { readonly country: (
        { readonly __typename?: 'SecuredBudgetReferenceCountry' }
        & Pick<Types.SecuredBudgetReferenceCountry, 'canRead' | 'canEdit'>
        & { readonly value?: Types.Maybe<(
          { readonly __typename?: 'BudgetReferenceCountry' }
          & Pick<Types.BudgetReferenceCountry, 'id' | 'name' | 'region' | 'keystoneCountryName' | 'currencyCode' | 'costOfLivingIndex' | 'indexMethodology' | 'adminFeeCap'>
        )> }
      ), readonly entryCurrencyMode: (
        { readonly __typename?: 'SecuredString' }
        & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
      ), readonly displayCurrencyMode: (
        { readonly __typename?: 'SecuredString' }
        & Pick<Types.SecuredString, 'canRead' | 'canEdit' | 'value'>
      ), readonly exchangeRate: (
        { readonly __typename?: 'SecuredFloat' }
        & Pick<Types.SecuredFloat, 'canRead' | 'canEdit' | 'value'>
      ), readonly inflationRate: (
        { readonly __typename?: 'SecuredFloat' }
        & Pick<Types.SecuredFloat, 'canRead' | 'canEdit' | 'value'>
      ), readonly adminFeePercent: (
        { readonly __typename?: 'SecuredFloat' }
        & Pick<Types.SecuredFloat, 'canRead' | 'canEdit' | 'value'>
      ), readonly languageCount: (
        { readonly __typename?: 'SecuredInt' }
        & Pick<Types.SecuredInt, 'canRead' | 'canEdit' | 'value'>
      ), readonly calculationSummary?: Types.Maybe<(
        { readonly __typename?: 'BudgetCalculationSummary' }
        & Pick<Types.BudgetCalculationSummary, 'bibleTranslationPercent' | 'funderBibleTranslationPercent' | 'costPerLanguage' | 'capped'>
        & { readonly totals: (
          { readonly __typename?: 'BudgetCalculationTotals' }
          & Pick<Types.BudgetCalculationTotals, 'cash' | 'inKind' | 'admin' | 'grandTotal' | 'totalCash' | 'otherPartnerContributions' | 'netToFunder' | 'adminFeeCap'>
        ), readonly fiscalYears: ReadonlyArray<(
          { readonly __typename?: 'BudgetCalculationFiscalYear' }
          & Pick<Types.BudgetCalculationFiscalYear, 'fiscalYear' | 'label' | 'cash' | 'inKind' | 'admin' | 'grandTotal' | 'totalCash' | 'otherPartnerContributions' | 'netToFunder' | 'adminFeeCap'>
        )> }
      )>, readonly changeset?: Types.Maybe<(
        { readonly __typename?: 'ProjectChangeRequest' }
        & Pick<Types.ProjectChangeRequest, 'id'>
      )> }
    ) }
  ) };

export type UpdateProjectBudgetUniversalTemplateMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  upload: Types.CreateDefinedFileVersion;
}>;


export type UpdateProjectBudgetUniversalTemplateMutation = { readonly updateBudget: (
    { readonly __typename?: 'BudgetUpdated' }
    & { readonly budget: (
      { readonly __typename: 'Budget' }
      & Pick<Types.Budget, 'id'>
      & { readonly universalTemplateFile: (
        { readonly __typename?: 'SecuredFile' }
        & { readonly value?: Types.Maybe<(
          { readonly __typename?: 'File' }
          & Pick<Types.File, 'id' | 'name' | 'type' | 'createdAt' | 'mimeType' | 'size' | 'modifiedAt' | 'url'>
          & { readonly children: (
            { readonly __typename?: 'FileListOutput' }
            & { readonly items: ReadonlyArray<(
              { readonly __typename?: 'Directory' }
              & Pick<Types.Directory, 'id' | 'name' | 'type' | 'createdAt'>
              & { readonly createdBy: (
                { readonly __typename?: 'User' }
                & Pick<Types.User, 'id' | 'fullName'>
              ) }
            ) | (
              { readonly __typename?: 'File' }
              & Pick<Types.File, 'id' | 'name' | 'type' | 'createdAt' | 'mimeType' | 'size' | 'modifiedAt' | 'url'>
              & { readonly createdBy: (
                { readonly __typename?: 'User' }
                & Pick<Types.User, 'id' | 'fullName'>
              ), readonly modifiedBy: (
                { readonly __typename?: 'User' }
                & Pick<Types.User, 'id' | 'fullName'>
              ) }
            ) | (
              { readonly __typename?: 'FileVersion' }
              & Pick<Types.FileVersion, 'mimeType' | 'size' | 'url' | 'id' | 'name' | 'type' | 'createdAt'>
              & { readonly createdBy: (
                { readonly __typename?: 'User' }
                & Pick<Types.User, 'id' | 'fullName'>
              ) }
            )> }
          ), readonly createdBy: (
            { readonly __typename?: 'User' }
            & Pick<Types.User, 'id' | 'fullName'>
          ), readonly modifiedBy: (
            { readonly __typename?: 'User' }
            & Pick<Types.User, 'id' | 'fullName'>
          ) }
        )> }
      ), readonly changeset?: Types.Maybe<(
        { readonly __typename?: 'ProjectChangeRequest' }
        & Pick<Types.ProjectChangeRequest, 'id'>
      )> }
    ) }
  ) };

export type UpdateProjectBudgetRecordMutationVariables = Types.Exact<{
  input: Types.UpdateBudgetRecord;
}>;


export type UpdateProjectBudgetRecordMutation = { readonly updateBudgetRecord: (
    { readonly __typename?: 'BudgetRecordUpdated' }
    & { readonly budgetRecord: (
      { readonly __typename: 'BudgetRecord' }
      & Pick<Types.BudgetRecord, 'id'>
      & { readonly amount: (
        { readonly __typename?: 'SecuredFloatNullable' }
        & Pick<Types.SecuredFloatNullable, 'value'>
      ), readonly preApprovedAmount: (
        { readonly __typename?: 'SecuredFloatNullable' }
        & Pick<Types.SecuredFloatNullable, 'value'>
      ), readonly initialAmount: (
        { readonly __typename?: 'SecuredFloatNullable' }
        & Pick<Types.SecuredFloatNullable, 'value'>
      ), readonly changeset?: Types.Maybe<(
        { readonly __typename?: 'ProjectChangeRequest' }
        & Pick<Types.ProjectChangeRequest, 'id'>
        & { readonly difference: (
          { readonly __typename?: 'ChangesetDiff' }
          & { readonly added: ReadonlyArray<(
            { readonly __typename: 'Budget' }
            & Pick<Types.Budget, 'id'>
            & { readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'BudgetLineItem' }
            & Pick<Types.BudgetLineItem, 'id'>
          ) | (
            { readonly __typename: 'BudgetRecord' }
            & Pick<Types.BudgetRecord, 'id'>
            & { readonly amount: (
              { readonly __typename?: 'SecuredFloatNullable' }
              & Pick<Types.SecuredFloatNullable, 'value'>
            ), readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'Ceremony' }
            & Pick<Types.Ceremony, 'id'>
          ) | (
            { readonly __typename: 'Comment' }
            & Pick<Types.Comment, 'id'>
          ) | (
            { readonly __typename: 'CommentThread' }
            & Pick<Types.CommentThread, 'id'>
          ) | (
            { readonly __typename: 'CommentViaMentionNotification' }
            & Pick<Types.CommentViaMentionNotification, 'id'>
          ) | (
            { readonly __typename: 'DerivativeScriptureProduct' }
            & Pick<Types.DerivativeScriptureProduct, 'id'>
          ) | (
            { readonly __typename: 'DirectScriptureProduct' }
            & Pick<Types.DirectScriptureProduct, 'id'>
          ) | (
            { readonly __typename: 'Directory' }
            & Pick<Types.Directory, 'id'>
          ) | (
            { readonly __typename: 'Education' }
            & Pick<Types.Education, 'id'>
          ) | (
            { readonly __typename: 'EthnoArt' }
            & Pick<Types.EthnoArt, 'id'>
          ) | (
            { readonly __typename: 'FieldRegion' }
            & Pick<Types.FieldRegion, 'id'>
          ) | (
            { readonly __typename: 'FieldZone' }
            & Pick<Types.FieldZone, 'id'>
          ) | (
            { readonly __typename: 'File' }
            & Pick<Types.File, 'id'>
          ) | (
            { readonly __typename: 'FileVersion' }
            & Pick<Types.FileVersion, 'id'>
          ) | (
            { readonly __typename: 'Film' }
            & Pick<Types.Film, 'id'>
          ) | (
            { readonly __typename: 'FinancialReport' }
            & Pick<Types.FinancialReport, 'id'>
          ) | (
            { readonly __typename: 'FundingAccount' }
            & Pick<Types.FundingAccount, 'id'>
          ) | (
            { readonly __typename: 'InternshipEngagement' }
            & Pick<Types.InternshipEngagement, 'id'>
            & { readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'InternshipProject' }
            & Pick<Types.InternshipProject, 'id'>
            & { projectStatus: Types.InternshipProject['status'] }
            & { readonly name: (
              { readonly __typename?: 'SecuredString' }
              & Pick<Types.SecuredString, 'value'>
            ), readonly mouRange: (
              { readonly __typename?: 'SecuredDateRange' }
              & { readonly value: (
                { readonly __typename?: 'DateRange' }
                & Pick<Types.DateRange, 'start' | 'end'>
              ) }
            ), readonly step: (
              { readonly __typename?: 'SecuredProjectStep' }
              & Pick<Types.SecuredProjectStep, 'value'>
            ), readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'Language' }
            & Pick<Types.Language, 'id'>
          ) | (
            { readonly __typename: 'LanguageEngagement' }
            & Pick<Types.LanguageEngagement, 'id'>
            & { readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'Location' }
            & Pick<Types.Location, 'id'>
          ) | (
            { readonly __typename: 'MomentumTranslationProject' }
            & Pick<Types.MomentumTranslationProject, 'id'>
            & { projectStatus: Types.MomentumTranslationProject['status'] }
            & { readonly name: (
              { readonly __typename?: 'SecuredString' }
              & Pick<Types.SecuredString, 'value'>
            ), readonly mouRange: (
              { readonly __typename?: 'SecuredDateRange' }
              & { readonly value: (
                { readonly __typename?: 'DateRange' }
                & Pick<Types.DateRange, 'start' | 'end'>
              ) }
            ), readonly step: (
              { readonly __typename?: 'SecuredProjectStep' }
              & Pick<Types.SecuredProjectStep, 'value'>
            ), readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'MultiplicationTranslationProject' }
            & Pick<Types.MultiplicationTranslationProject, 'id'>
            & { projectStatus: Types.MultiplicationTranslationProject['status'] }
            & { readonly name: (
              { readonly __typename?: 'SecuredString' }
              & Pick<Types.SecuredString, 'value'>
            ), readonly mouRange: (
              { readonly __typename?: 'SecuredDateRange' }
              & { readonly value: (
                { readonly __typename?: 'DateRange' }
                & Pick<Types.DateRange, 'start' | 'end'>
              ) }
            ), readonly step: (
              { readonly __typename?: 'SecuredProjectStep' }
              & Pick<Types.SecuredProjectStep, 'value'>
            ), readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'NarrativeReport' }
            & Pick<Types.NarrativeReport, 'id'>
          ) | (
            { readonly __typename: 'Organization' }
            & Pick<Types.Organization, 'id'>
          ) | (
            { readonly __typename: 'OtherPartnerContribution' }
            & Pick<Types.OtherPartnerContribution, 'id'>
          ) | (
            { readonly __typename: 'OtherProduct' }
            & Pick<Types.OtherProduct, 'id'>
          ) | (
            { readonly __typename: 'Partner' }
            & Pick<Types.Partner, 'id'>
          ) | (
            { readonly __typename: 'Partnership' }
            & Pick<Types.Partnership, 'id'>
            & { readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'Post' }
            & Pick<Types.Post, 'id'>
          ) | (
            { readonly __typename: 'ProgressReport' }
            & Pick<Types.ProgressReport, 'id'>
          ) | (
            { readonly __typename: 'ProjectChangeRequest' }
            & Pick<Types.ProjectChangeRequest, 'id'>
          ) | (
            { readonly __typename: 'ProjectMember' }
            & Pick<Types.ProjectMember, 'id'>
          ) | (
            { readonly __typename: 'Story' }
            & Pick<Types.Story, 'id'>
          ) | (
            { readonly __typename: 'SystemNotification' }
            & Pick<Types.SystemNotification, 'id'>
          ) | (
            { readonly __typename: 'Tool' }
            & Pick<Types.Tool, 'id'>
          ) | (
            { readonly __typename: 'ToolUsage' }
            & Pick<Types.ToolUsage, 'id'>
          ) | (
            { readonly __typename: 'Unavailability' }
            & Pick<Types.Unavailability, 'id'>
          ) | (
            { readonly __typename: 'User' }
            & Pick<Types.User, 'id'>
          )>, readonly removed: ReadonlyArray<(
            { readonly __typename: 'Budget' }
            & Pick<Types.Budget, 'id'>
            & { readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'BudgetLineItem' }
            & Pick<Types.BudgetLineItem, 'id'>
          ) | (
            { readonly __typename: 'BudgetRecord' }
            & Pick<Types.BudgetRecord, 'id'>
            & { readonly amount: (
              { readonly __typename?: 'SecuredFloatNullable' }
              & Pick<Types.SecuredFloatNullable, 'value'>
            ), readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'Ceremony' }
            & Pick<Types.Ceremony, 'id'>
          ) | (
            { readonly __typename: 'Comment' }
            & Pick<Types.Comment, 'id'>
          ) | (
            { readonly __typename: 'CommentThread' }
            & Pick<Types.CommentThread, 'id'>
          ) | (
            { readonly __typename: 'CommentViaMentionNotification' }
            & Pick<Types.CommentViaMentionNotification, 'id'>
          ) | (
            { readonly __typename: 'DerivativeScriptureProduct' }
            & Pick<Types.DerivativeScriptureProduct, 'id'>
          ) | (
            { readonly __typename: 'DirectScriptureProduct' }
            & Pick<Types.DirectScriptureProduct, 'id'>
          ) | (
            { readonly __typename: 'Directory' }
            & Pick<Types.Directory, 'id'>
          ) | (
            { readonly __typename: 'Education' }
            & Pick<Types.Education, 'id'>
          ) | (
            { readonly __typename: 'EthnoArt' }
            & Pick<Types.EthnoArt, 'id'>
          ) | (
            { readonly __typename: 'FieldRegion' }
            & Pick<Types.FieldRegion, 'id'>
          ) | (
            { readonly __typename: 'FieldZone' }
            & Pick<Types.FieldZone, 'id'>
          ) | (
            { readonly __typename: 'File' }
            & Pick<Types.File, 'id'>
          ) | (
            { readonly __typename: 'FileVersion' }
            & Pick<Types.FileVersion, 'id'>
          ) | (
            { readonly __typename: 'Film' }
            & Pick<Types.Film, 'id'>
          ) | (
            { readonly __typename: 'FinancialReport' }
            & Pick<Types.FinancialReport, 'id'>
          ) | (
            { readonly __typename: 'FundingAccount' }
            & Pick<Types.FundingAccount, 'id'>
          ) | (
            { readonly __typename: 'InternshipEngagement' }
            & Pick<Types.InternshipEngagement, 'id'>
            & { readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'InternshipProject' }
            & Pick<Types.InternshipProject, 'id'>
            & { projectStatus: Types.InternshipProject['status'] }
            & { readonly name: (
              { readonly __typename?: 'SecuredString' }
              & Pick<Types.SecuredString, 'value'>
            ), readonly mouRange: (
              { readonly __typename?: 'SecuredDateRange' }
              & { readonly value: (
                { readonly __typename?: 'DateRange' }
                & Pick<Types.DateRange, 'start' | 'end'>
              ) }
            ), readonly step: (
              { readonly __typename?: 'SecuredProjectStep' }
              & Pick<Types.SecuredProjectStep, 'value'>
            ), readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'Language' }
            & Pick<Types.Language, 'id'>
          ) | (
            { readonly __typename: 'LanguageEngagement' }
            & Pick<Types.LanguageEngagement, 'id'>
            & { readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'Location' }
            & Pick<Types.Location, 'id'>
          ) | (
            { readonly __typename: 'MomentumTranslationProject' }
            & Pick<Types.MomentumTranslationProject, 'id'>
            & { projectStatus: Types.MomentumTranslationProject['status'] }
            & { readonly name: (
              { readonly __typename?: 'SecuredString' }
              & Pick<Types.SecuredString, 'value'>
            ), readonly mouRange: (
              { readonly __typename?: 'SecuredDateRange' }
              & { readonly value: (
                { readonly __typename?: 'DateRange' }
                & Pick<Types.DateRange, 'start' | 'end'>
              ) }
            ), readonly step: (
              { readonly __typename?: 'SecuredProjectStep' }
              & Pick<Types.SecuredProjectStep, 'value'>
            ), readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'MultiplicationTranslationProject' }
            & Pick<Types.MultiplicationTranslationProject, 'id'>
            & { projectStatus: Types.MultiplicationTranslationProject['status'] }
            & { readonly name: (
              { readonly __typename?: 'SecuredString' }
              & Pick<Types.SecuredString, 'value'>
            ), readonly mouRange: (
              { readonly __typename?: 'SecuredDateRange' }
              & { readonly value: (
                { readonly __typename?: 'DateRange' }
                & Pick<Types.DateRange, 'start' | 'end'>
              ) }
            ), readonly step: (
              { readonly __typename?: 'SecuredProjectStep' }
              & Pick<Types.SecuredProjectStep, 'value'>
            ), readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'NarrativeReport' }
            & Pick<Types.NarrativeReport, 'id'>
          ) | (
            { readonly __typename: 'Organization' }
            & Pick<Types.Organization, 'id'>
          ) | (
            { readonly __typename: 'OtherPartnerContribution' }
            & Pick<Types.OtherPartnerContribution, 'id'>
          ) | (
            { readonly __typename: 'OtherProduct' }
            & Pick<Types.OtherProduct, 'id'>
          ) | (
            { readonly __typename: 'Partner' }
            & Pick<Types.Partner, 'id'>
          ) | (
            { readonly __typename: 'Partnership' }
            & Pick<Types.Partnership, 'id'>
            & { readonly changeset?: Types.Maybe<(
              { readonly __typename?: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            )> }
          ) | (
            { readonly __typename: 'Post' }
            & Pick<Types.Post, 'id'>
          ) | (
            { readonly __typename: 'ProgressReport' }
            & Pick<Types.ProgressReport, 'id'>
          ) | (
            { readonly __typename: 'ProjectChangeRequest' }
            & Pick<Types.ProjectChangeRequest, 'id'>
          ) | (
            { readonly __typename: 'ProjectMember' }
            & Pick<Types.ProjectMember, 'id'>
          ) | (
            { readonly __typename: 'Story' }
            & Pick<Types.Story, 'id'>
          ) | (
            { readonly __typename: 'SystemNotification' }
            & Pick<Types.SystemNotification, 'id'>
          ) | (
            { readonly __typename: 'Tool' }
            & Pick<Types.Tool, 'id'>
          ) | (
            { readonly __typename: 'ToolUsage' }
            & Pick<Types.ToolUsage, 'id'>
          ) | (
            { readonly __typename: 'Unavailability' }
            & Pick<Types.Unavailability, 'id'>
          ) | (
            { readonly __typename: 'User' }
            & Pick<Types.User, 'id'>
          )>, readonly changed: ReadonlyArray<(
            { readonly __typename?: 'ResourceChange' }
            & { readonly previous: (
              { readonly __typename: 'Budget' }
              & Pick<Types.Budget, 'id'>
              & { readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'BudgetLineItem' }
              & Pick<Types.BudgetLineItem, 'id'>
            ) | (
              { readonly __typename: 'BudgetRecord' }
              & Pick<Types.BudgetRecord, 'id'>
              & { readonly amount: (
                { readonly __typename?: 'SecuredFloatNullable' }
                & Pick<Types.SecuredFloatNullable, 'value'>
              ), readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'Ceremony' }
              & Pick<Types.Ceremony, 'id'>
            ) | (
              { readonly __typename: 'Comment' }
              & Pick<Types.Comment, 'id'>
            ) | (
              { readonly __typename: 'CommentThread' }
              & Pick<Types.CommentThread, 'id'>
            ) | (
              { readonly __typename: 'CommentViaMentionNotification' }
              & Pick<Types.CommentViaMentionNotification, 'id'>
            ) | (
              { readonly __typename: 'DerivativeScriptureProduct' }
              & Pick<Types.DerivativeScriptureProduct, 'id'>
            ) | (
              { readonly __typename: 'DirectScriptureProduct' }
              & Pick<Types.DirectScriptureProduct, 'id'>
            ) | (
              { readonly __typename: 'Directory' }
              & Pick<Types.Directory, 'id'>
            ) | (
              { readonly __typename: 'Education' }
              & Pick<Types.Education, 'id'>
            ) | (
              { readonly __typename: 'EthnoArt' }
              & Pick<Types.EthnoArt, 'id'>
            ) | (
              { readonly __typename: 'FieldRegion' }
              & Pick<Types.FieldRegion, 'id'>
            ) | (
              { readonly __typename: 'FieldZone' }
              & Pick<Types.FieldZone, 'id'>
            ) | (
              { readonly __typename: 'File' }
              & Pick<Types.File, 'id'>
            ) | (
              { readonly __typename: 'FileVersion' }
              & Pick<Types.FileVersion, 'id'>
            ) | (
              { readonly __typename: 'Film' }
              & Pick<Types.Film, 'id'>
            ) | (
              { readonly __typename: 'FinancialReport' }
              & Pick<Types.FinancialReport, 'id'>
            ) | (
              { readonly __typename: 'FundingAccount' }
              & Pick<Types.FundingAccount, 'id'>
            ) | (
              { readonly __typename: 'InternshipEngagement' }
              & Pick<Types.InternshipEngagement, 'id'>
              & { readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'InternshipProject' }
              & Pick<Types.InternshipProject, 'id'>
              & { projectStatus: Types.InternshipProject['status'] }
              & { readonly name: (
                { readonly __typename?: 'SecuredString' }
                & Pick<Types.SecuredString, 'value'>
              ), readonly mouRange: (
                { readonly __typename?: 'SecuredDateRange' }
                & { readonly value: (
                  { readonly __typename?: 'DateRange' }
                  & Pick<Types.DateRange, 'start' | 'end'>
                ) }
              ), readonly step: (
                { readonly __typename?: 'SecuredProjectStep' }
                & Pick<Types.SecuredProjectStep, 'value'>
              ), readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'Language' }
              & Pick<Types.Language, 'id'>
            ) | (
              { readonly __typename: 'LanguageEngagement' }
              & Pick<Types.LanguageEngagement, 'id'>
              & { readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'Location' }
              & Pick<Types.Location, 'id'>
            ) | (
              { readonly __typename: 'MomentumTranslationProject' }
              & Pick<Types.MomentumTranslationProject, 'id'>
              & { projectStatus: Types.MomentumTranslationProject['status'] }
              & { readonly name: (
                { readonly __typename?: 'SecuredString' }
                & Pick<Types.SecuredString, 'value'>
              ), readonly mouRange: (
                { readonly __typename?: 'SecuredDateRange' }
                & { readonly value: (
                  { readonly __typename?: 'DateRange' }
                  & Pick<Types.DateRange, 'start' | 'end'>
                ) }
              ), readonly step: (
                { readonly __typename?: 'SecuredProjectStep' }
                & Pick<Types.SecuredProjectStep, 'value'>
              ), readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'MultiplicationTranslationProject' }
              & Pick<Types.MultiplicationTranslationProject, 'id'>
              & { projectStatus: Types.MultiplicationTranslationProject['status'] }
              & { readonly name: (
                { readonly __typename?: 'SecuredString' }
                & Pick<Types.SecuredString, 'value'>
              ), readonly mouRange: (
                { readonly __typename?: 'SecuredDateRange' }
                & { readonly value: (
                  { readonly __typename?: 'DateRange' }
                  & Pick<Types.DateRange, 'start' | 'end'>
                ) }
              ), readonly step: (
                { readonly __typename?: 'SecuredProjectStep' }
                & Pick<Types.SecuredProjectStep, 'value'>
              ), readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'NarrativeReport' }
              & Pick<Types.NarrativeReport, 'id'>
            ) | (
              { readonly __typename: 'Organization' }
              & Pick<Types.Organization, 'id'>
            ) | (
              { readonly __typename: 'OtherPartnerContribution' }
              & Pick<Types.OtherPartnerContribution, 'id'>
            ) | (
              { readonly __typename: 'OtherProduct' }
              & Pick<Types.OtherProduct, 'id'>
            ) | (
              { readonly __typename: 'Partner' }
              & Pick<Types.Partner, 'id'>
            ) | (
              { readonly __typename: 'Partnership' }
              & Pick<Types.Partnership, 'id'>
              & { readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'Post' }
              & Pick<Types.Post, 'id'>
            ) | (
              { readonly __typename: 'ProgressReport' }
              & Pick<Types.ProgressReport, 'id'>
            ) | (
              { readonly __typename: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            ) | (
              { readonly __typename: 'ProjectMember' }
              & Pick<Types.ProjectMember, 'id'>
            ) | (
              { readonly __typename: 'Story' }
              & Pick<Types.Story, 'id'>
            ) | (
              { readonly __typename: 'SystemNotification' }
              & Pick<Types.SystemNotification, 'id'>
            ) | (
              { readonly __typename: 'Tool' }
              & Pick<Types.Tool, 'id'>
            ) | (
              { readonly __typename: 'ToolUsage' }
              & Pick<Types.ToolUsage, 'id'>
            ) | (
              { readonly __typename: 'Unavailability' }
              & Pick<Types.Unavailability, 'id'>
            ) | (
              { readonly __typename: 'User' }
              & Pick<Types.User, 'id'>
            ), readonly updated: (
              { readonly __typename: 'Budget' }
              & Pick<Types.Budget, 'id'>
              & { readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'BudgetLineItem' }
              & Pick<Types.BudgetLineItem, 'id'>
            ) | (
              { readonly __typename: 'BudgetRecord' }
              & Pick<Types.BudgetRecord, 'id'>
              & { readonly amount: (
                { readonly __typename?: 'SecuredFloatNullable' }
                & Pick<Types.SecuredFloatNullable, 'value'>
              ), readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'Ceremony' }
              & Pick<Types.Ceremony, 'id'>
            ) | (
              { readonly __typename: 'Comment' }
              & Pick<Types.Comment, 'id'>
            ) | (
              { readonly __typename: 'CommentThread' }
              & Pick<Types.CommentThread, 'id'>
            ) | (
              { readonly __typename: 'CommentViaMentionNotification' }
              & Pick<Types.CommentViaMentionNotification, 'id'>
            ) | (
              { readonly __typename: 'DerivativeScriptureProduct' }
              & Pick<Types.DerivativeScriptureProduct, 'id'>
            ) | (
              { readonly __typename: 'DirectScriptureProduct' }
              & Pick<Types.DirectScriptureProduct, 'id'>
            ) | (
              { readonly __typename: 'Directory' }
              & Pick<Types.Directory, 'id'>
            ) | (
              { readonly __typename: 'Education' }
              & Pick<Types.Education, 'id'>
            ) | (
              { readonly __typename: 'EthnoArt' }
              & Pick<Types.EthnoArt, 'id'>
            ) | (
              { readonly __typename: 'FieldRegion' }
              & Pick<Types.FieldRegion, 'id'>
            ) | (
              { readonly __typename: 'FieldZone' }
              & Pick<Types.FieldZone, 'id'>
            ) | (
              { readonly __typename: 'File' }
              & Pick<Types.File, 'id'>
            ) | (
              { readonly __typename: 'FileVersion' }
              & Pick<Types.FileVersion, 'id'>
            ) | (
              { readonly __typename: 'Film' }
              & Pick<Types.Film, 'id'>
            ) | (
              { readonly __typename: 'FinancialReport' }
              & Pick<Types.FinancialReport, 'id'>
            ) | (
              { readonly __typename: 'FundingAccount' }
              & Pick<Types.FundingAccount, 'id'>
            ) | (
              { readonly __typename: 'InternshipEngagement' }
              & Pick<Types.InternshipEngagement, 'id'>
              & { readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'InternshipProject' }
              & Pick<Types.InternshipProject, 'id'>
              & { projectStatus: Types.InternshipProject['status'] }
              & { readonly name: (
                { readonly __typename?: 'SecuredString' }
                & Pick<Types.SecuredString, 'value'>
              ), readonly mouRange: (
                { readonly __typename?: 'SecuredDateRange' }
                & { readonly value: (
                  { readonly __typename?: 'DateRange' }
                  & Pick<Types.DateRange, 'start' | 'end'>
                ) }
              ), readonly step: (
                { readonly __typename?: 'SecuredProjectStep' }
                & Pick<Types.SecuredProjectStep, 'value'>
              ), readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'Language' }
              & Pick<Types.Language, 'id'>
            ) | (
              { readonly __typename: 'LanguageEngagement' }
              & Pick<Types.LanguageEngagement, 'id'>
              & { readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'Location' }
              & Pick<Types.Location, 'id'>
            ) | (
              { readonly __typename: 'MomentumTranslationProject' }
              & Pick<Types.MomentumTranslationProject, 'id'>
              & { projectStatus: Types.MomentumTranslationProject['status'] }
              & { readonly name: (
                { readonly __typename?: 'SecuredString' }
                & Pick<Types.SecuredString, 'value'>
              ), readonly mouRange: (
                { readonly __typename?: 'SecuredDateRange' }
                & { readonly value: (
                  { readonly __typename?: 'DateRange' }
                  & Pick<Types.DateRange, 'start' | 'end'>
                ) }
              ), readonly step: (
                { readonly __typename?: 'SecuredProjectStep' }
                & Pick<Types.SecuredProjectStep, 'value'>
              ), readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'MultiplicationTranslationProject' }
              & Pick<Types.MultiplicationTranslationProject, 'id'>
              & { projectStatus: Types.MultiplicationTranslationProject['status'] }
              & { readonly name: (
                { readonly __typename?: 'SecuredString' }
                & Pick<Types.SecuredString, 'value'>
              ), readonly mouRange: (
                { readonly __typename?: 'SecuredDateRange' }
                & { readonly value: (
                  { readonly __typename?: 'DateRange' }
                  & Pick<Types.DateRange, 'start' | 'end'>
                ) }
              ), readonly step: (
                { readonly __typename?: 'SecuredProjectStep' }
                & Pick<Types.SecuredProjectStep, 'value'>
              ), readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'NarrativeReport' }
              & Pick<Types.NarrativeReport, 'id'>
            ) | (
              { readonly __typename: 'Organization' }
              & Pick<Types.Organization, 'id'>
            ) | (
              { readonly __typename: 'OtherPartnerContribution' }
              & Pick<Types.OtherPartnerContribution, 'id'>
            ) | (
              { readonly __typename: 'OtherProduct' }
              & Pick<Types.OtherProduct, 'id'>
            ) | (
              { readonly __typename: 'Partner' }
              & Pick<Types.Partner, 'id'>
            ) | (
              { readonly __typename: 'Partnership' }
              & Pick<Types.Partnership, 'id'>
              & { readonly changeset?: Types.Maybe<(
                { readonly __typename?: 'ProjectChangeRequest' }
                & Pick<Types.ProjectChangeRequest, 'id'>
              )> }
            ) | (
              { readonly __typename: 'Post' }
              & Pick<Types.Post, 'id'>
            ) | (
              { readonly __typename: 'ProgressReport' }
              & Pick<Types.ProgressReport, 'id'>
            ) | (
              { readonly __typename: 'ProjectChangeRequest' }
              & Pick<Types.ProjectChangeRequest, 'id'>
            ) | (
              { readonly __typename: 'ProjectMember' }
              & Pick<Types.ProjectMember, 'id'>
            ) | (
              { readonly __typename: 'Story' }
              & Pick<Types.Story, 'id'>
            ) | (
              { readonly __typename: 'SystemNotification' }
              & Pick<Types.SystemNotification, 'id'>
            ) | (
              { readonly __typename: 'Tool' }
              & Pick<Types.Tool, 'id'>
            ) | (
              { readonly __typename: 'ToolUsage' }
              & Pick<Types.ToolUsage, 'id'>
            ) | (
              { readonly __typename: 'Unavailability' }
              & Pick<Types.Unavailability, 'id'>
            ) | (
              { readonly __typename: 'User' }
              & Pick<Types.User, 'id'>
            ) }
          )> }
        ) }
      )> }
    ) }
  ) };

export type CalculateNewTotalAndRollupFragment = (
  { readonly __typename: 'Budget' }
  & Pick<Types.Budget, 'total' | 'id'>
  & { readonly summary: (
    { readonly __typename?: 'BudgetSummary' }
    & Pick<Types.BudgetSummary, 'hasPreApproved' | 'preApprovedExceeded'>
  ), readonly records: ReadonlyArray<(
    { readonly __typename: 'BudgetRecord' }
    & Pick<Types.BudgetRecord, 'id'>
    & { readonly amount: (
      { readonly __typename?: 'SecuredFloatNullable' }
      & Pick<Types.SecuredFloatNullable, 'value'>
    ), readonly preApprovedAmount: (
      { readonly __typename?: 'SecuredFloatNullable' }
      & Pick<Types.SecuredFloatNullable, 'value'>
    ), readonly initialAmount: (
      { readonly __typename?: 'SecuredFloatNullable' }
      & Pick<Types.SecuredFloatNullable, 'value'>
    ), readonly changeset?: Types.Maybe<(
      { readonly __typename?: 'ProjectChangeRequest' }
      & Pick<Types.ProjectChangeRequest, 'id'>
    )> }
  )>, readonly changeset?: Types.Maybe<(
    { readonly __typename?: 'ProjectChangeRequest' }
    & Pick<Types.ProjectChangeRequest, 'id'>
  )> }
);

export const BudgetRecordFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetRecord"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetRecord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preApprovedAmount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canRead"}}]}},{"kind":"Field","name":{"kind":"Name","value":"initialAmount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canRead"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fiscalYear"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChangesetId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChangesetAware"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changeset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Id"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChangesetId"}}]}}]} as unknown as DocumentNode<BudgetRecordFragment, unknown>;
export const CalculateNewTotalAndRollupFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CalculateNewTotalAndRollup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Budget"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPreApproved"}},{"kind":"Field","name":{"kind":"Name","value":"preApprovedExceeded"}}]}},{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preApprovedAmount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"initialAmount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChangesetId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChangesetAware"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changeset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Id"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChangesetId"}}]}}]} as unknown as DocumentNode<CalculateNewTotalAndRollupFragment, unknown>;
export const ProjectBudgetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProjectBudget"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"changeset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"live"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"changeset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"changeset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectBreadcrumb"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mouStart"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mouEnd"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partnerships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryPartnership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"budget"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetOverview"}},{"kind":"Field","name":{"kind":"Name","value":"records"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetRecord"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"universalTemplateFile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileNodeInfo"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetReferenceCountry"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"entryCurrencyMode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayCurrencyMode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inflationRate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"adminFeePercent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"languageCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lineItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetLineItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"otherPartnerContributions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OtherPartnerContribution"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calculationSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetCalculationSummary"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChangesetId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChangesetAware"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changeset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Id"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChangesetId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"File"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"download"},"value":{"kind":"BooleanValue","value":true}}]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetCalculationTotals"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetCalculationTotals"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cash"}},{"kind":"Field","name":{"kind":"Name","value":"inKind"}},{"kind":"Field","name":{"kind":"Name","value":"admin"}},{"kind":"Field","name":{"kind":"Name","value":"grandTotal"}},{"kind":"Field","name":{"kind":"Name","value":"totalCash"}},{"kind":"Field","name":{"kind":"Name","value":"otherPartnerContributions"}},{"kind":"Field","name":{"kind":"Name","value":"netToFunder"}},{"kind":"Field","name":{"kind":"Name","value":"adminFeeCap"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetCalculationFiscalYear"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetCalculationFiscalYear"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fiscalYear"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"cash"}},{"kind":"Field","name":{"kind":"Name","value":"inKind"}},{"kind":"Field","name":{"kind":"Name","value":"admin"}},{"kind":"Field","name":{"kind":"Name","value":"grandTotal"}},{"kind":"Field","name":{"kind":"Name","value":"totalCash"}},{"kind":"Field","name":{"kind":"Name","value":"otherPartnerContributions"}},{"kind":"Field","name":{"kind":"Name","value":"netToFunder"}},{"kind":"Field","name":{"kind":"Name","value":"adminFeeCap"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectBreadcrumb"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sensitivity"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetOverview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Budget"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPreApproved"}},{"kind":"Field","name":{"kind":"Name","value":"preApprovedExceeded"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"project"},"name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetRecord"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetRecord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preApprovedAmount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canRead"}}]}},{"kind":"Field","name":{"kind":"Name","value":"initialAmount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canRead"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fiscalYear"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileNodeInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"File"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileInfo"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileVersion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"download"},"value":{"kind":"BooleanValue","value":true}}]}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetReferenceCountry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetReferenceCountry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"keystoneCountryName"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"costOfLivingIndex"}},{"kind":"Field","name":{"kind":"Name","value":"indexMethodology"}},{"kind":"Field","name":{"kind":"Name","value":"adminFeeCap"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetLineItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetLineItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"costType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"budgetCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serviceProvider"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"funder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fiscalYearAmounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OtherPartnerContribution"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OtherPartnerContribution"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"canDelete"}},{"kind":"Field","name":{"kind":"Name","value":"donor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fiscalYearAmounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetCalculationSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetCalculationSummary"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bibleTranslationPercent"}},{"kind":"Field","name":{"kind":"Name","value":"funderBibleTranslationPercent"}},{"kind":"Field","name":{"kind":"Name","value":"costPerLanguage"}},{"kind":"Field","name":{"kind":"Name","value":"capped"}},{"kind":"Field","name":{"kind":"Name","value":"totals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetCalculationTotals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fiscalYears"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetCalculationFiscalYear"}}]}}]}}]} as unknown as DocumentNode<ProjectBudgetQuery, ProjectBudgetQueryVariables>;
export const UpdateBudgetAssumptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBudgetAssumptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBudget"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBudget"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budget"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetReferenceCountry"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"entryCurrencyMode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayCurrencyMode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inflationRate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"adminFeePercent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"languageCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRead"}},{"kind":"Field","name":{"kind":"Name","value":"canEdit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calculationSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetCalculationSummary"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChangesetId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChangesetAware"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changeset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetCalculationTotals"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetCalculationTotals"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cash"}},{"kind":"Field","name":{"kind":"Name","value":"inKind"}},{"kind":"Field","name":{"kind":"Name","value":"admin"}},{"kind":"Field","name":{"kind":"Name","value":"grandTotal"}},{"kind":"Field","name":{"kind":"Name","value":"totalCash"}},{"kind":"Field","name":{"kind":"Name","value":"otherPartnerContributions"}},{"kind":"Field","name":{"kind":"Name","value":"netToFunder"}},{"kind":"Field","name":{"kind":"Name","value":"adminFeeCap"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetCalculationFiscalYear"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetCalculationFiscalYear"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fiscalYear"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"cash"}},{"kind":"Field","name":{"kind":"Name","value":"inKind"}},{"kind":"Field","name":{"kind":"Name","value":"admin"}},{"kind":"Field","name":{"kind":"Name","value":"grandTotal"}},{"kind":"Field","name":{"kind":"Name","value":"totalCash"}},{"kind":"Field","name":{"kind":"Name","value":"otherPartnerContributions"}},{"kind":"Field","name":{"kind":"Name","value":"netToFunder"}},{"kind":"Field","name":{"kind":"Name","value":"adminFeeCap"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Id"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChangesetId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetReferenceCountry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetReferenceCountry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"keystoneCountryName"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"costOfLivingIndex"}},{"kind":"Field","name":{"kind":"Name","value":"indexMethodology"}},{"kind":"Field","name":{"kind":"Name","value":"adminFeeCap"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetCalculationSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetCalculationSummary"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bibleTranslationPercent"}},{"kind":"Field","name":{"kind":"Name","value":"funderBibleTranslationPercent"}},{"kind":"Field","name":{"kind":"Name","value":"costPerLanguage"}},{"kind":"Field","name":{"kind":"Name","value":"capped"}},{"kind":"Field","name":{"kind":"Name","value":"totals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetCalculationTotals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fiscalYears"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetCalculationFiscalYear"}}]}}]}}]} as unknown as DocumentNode<UpdateBudgetAssumptionsMutation, UpdateBudgetAssumptionsMutationVariables>;
export const UpdateProjectBudgetUniversalTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProjectBudgetUniversalTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"upload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDefinedFileVersion"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBudget"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"universalTemplateFile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"upload"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budget"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"universalTemplateFile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileNodeInfo"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileNodeInfo"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChangesetId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChangesetAware"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changeset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"File"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"download"},"value":{"kind":"BooleanValue","value":true}}]}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Id"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChangesetId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileNodeInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"File"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileInfo"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FileVersion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"url"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"download"},"value":{"kind":"BooleanValue","value":true}}]}]}}]}}]} as unknown as DocumentNode<UpdateProjectBudgetUniversalTemplateMutation, UpdateProjectBudgetUniversalTemplateMutationVariables>;
export const UpdateProjectBudgetRecordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProjectBudgetRecord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBudgetRecord"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBudgetRecord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budgetRecord"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preApprovedAmount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"initialAmount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecalculateChangesetDiff"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChangesetId"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChangesetAware"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changeset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Id"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChangesetId"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectChangesetDiff"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mouRange"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"step"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"projectStatus"},"name":{"kind":"Name","value":"status"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BudgetRecordChangesetDiff"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetRecord"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChangesetDiffItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectChangesetDiff"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BudgetRecordChangesetDiff"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChangesetDiff"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChangesetDiff"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"added"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChangesetDiffItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"removed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChangesetDiffItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"changed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"previous"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChangesetDiffItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChangesetDiffItem"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecalculateChangesetDiff"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChangesetAware"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changeset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"difference"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChangesetDiff"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateProjectBudgetRecordMutation, UpdateProjectBudgetRecordMutationVariables>;