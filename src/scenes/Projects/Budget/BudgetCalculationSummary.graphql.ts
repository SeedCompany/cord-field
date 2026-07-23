/**
 * HAND-WRITTEN, see BudgetReferenceCountry.graphql.ts's header comment for
 * why (no live backend reachable to run real codegen) and the conventions
 * followed.
 */
import { gql } from '@apollo/client';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import type * as Types from '~/api/schema.graphql';

export type BudgetCalculationFiscalYearFragment = { readonly __typename?: 'BudgetCalculationFiscalYear' }
  & Pick<Types.BudgetCalculationFiscalYear, 'fiscalYear' | 'label' | 'cash' | 'inKind' | 'admin' | 'grandTotal' | 'totalCash' | 'otherPartnerContributions' | 'netToFunder' | 'adminFeeCap'>;

export const BudgetCalculationFiscalYearFragmentDoc = gql`
  fragment BudgetCalculationFiscalYear on BudgetCalculationFiscalYear {
    fiscalYear
    label
    cash
    inKind
    admin
    grandTotal
    totalCash
    otherPartnerContributions
    netToFunder
    adminFeeCap
  }
` as unknown as DocumentNode<BudgetCalculationFiscalYearFragment, unknown>;

export type BudgetCalculationTotalsFragment = { readonly __typename?: 'BudgetCalculationTotals' }
  & Pick<Types.BudgetCalculationTotals, 'cash' | 'inKind' | 'admin' | 'grandTotal' | 'totalCash' | 'otherPartnerContributions' | 'netToFunder' | 'adminFeeCap'>;

export const BudgetCalculationTotalsFragmentDoc = gql`
  fragment BudgetCalculationTotals on BudgetCalculationTotals {
    cash
    inKind
    admin
    grandTotal
    totalCash
    otherPartnerContributions
    netToFunder
    adminFeeCap
  }
` as unknown as DocumentNode<BudgetCalculationTotalsFragment, unknown>;

export type BudgetCalculationSummaryFragment = { readonly __typename?: 'BudgetCalculationSummary' }
  & Pick<Types.BudgetCalculationSummary, 'bibleTranslationPercent' | 'funderBibleTranslationPercent' | 'costPerLanguage' | 'capped'>
  & {
    readonly totals: BudgetCalculationTotalsFragment;
    readonly fiscalYears: ReadonlyArray<BudgetCalculationFiscalYearFragment>;
  };

export const BudgetCalculationSummaryFragmentDoc = gql`
  fragment BudgetCalculationSummary on BudgetCalculationSummary {
    bibleTranslationPercent
    funderBibleTranslationPercent
    costPerLanguage
    capped
    totals {
      ...BudgetCalculationTotals
    }
    fiscalYears {
      ...BudgetCalculationFiscalYear
    }
  }
  ${BudgetCalculationTotalsFragmentDoc}
  ${BudgetCalculationFiscalYearFragmentDoc}
` as unknown as DocumentNode<BudgetCalculationSummaryFragment, unknown>;
