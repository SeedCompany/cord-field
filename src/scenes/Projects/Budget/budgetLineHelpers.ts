import { useMemo } from 'react';
import { SecuredProp } from '~/common';
import { ProjectBudgetQuery } from './ProjectBudget.graphql';

/**
 * budget-line-items-poc: shared helpers pulled out of `ProjectBudgetLineItems`
 * so the Other-Partner-Contributions grid, the Breakdown tab, and the
 * Partner-Budgets tab (all added in this pass) can reuse the exact same
 * fiscal-year-column derivation and amount helpers instead of re-implementing
 * them per file.
 */

export type Budget = NonNullable<
  NonNullable<ProjectBudgetQuery['project']['budget']>['value']
>;

export type FiscalYearAmounts = Record<string, number>;

export interface FiscalYearColumn {
  readonly year: number;
  readonly label: string;
}

export const getAmounts = (
  secured: SecuredProp<any>
): FiscalYearAmounts | null | undefined =>
  secured.value as FiscalYearAmounts | null | undefined;

export const getSecuredValue = (secured: SecuredProp<any>) => secured.value;

/** Sum of a fiscal-year-amounts map across every year present in it. */
export const sumAmounts = (
  amounts: FiscalYearAmounts | null | undefined
): number =>
  Object.values(amounts ?? {}).reduce(
    (total, value) => total + (Number(value) || 0),
    0
  );

/** The amount for one specific fiscal year, defaulting to 0. */
export const amountForYear = (
  amounts: FiscalYearAmounts | null | undefined,
  year: number
): number => Number(amounts?.[String(year)]) || 0;

/**
 * Fiscal-year columns for the budget's grids and the Breakdown/Partner-Budgets
 * tabs. Prefers the calc engine's (backend) fiscal years; falls back to
 * whatever years already have data if the project's dates aren't set yet
 * (`calculationSummary` is null in that case) -- ported from the same
 * fallback that originally lived inline in `ProjectBudgetLineItems`.
 */
export const useFiscalYearColumns = (
  budget: Budget | undefined
): readonly FiscalYearColumn[] =>
  useMemo(() => {
    const fromSummary = budget?.calculationSummary?.fiscalYears.map((fy) => ({
      year: fy.fiscalYear,
      label: fy.label,
    }));
    if (fromSummary && fromSummary.length > 0) {
      return fromSummary;
    }
    const years = new Set<number>();
    for (const li of budget?.lineItems ?? []) {
      const amounts = getAmounts(li.fiscalYearAmounts);
      for (const key of Object.keys(amounts ?? {})) {
        const year = Number(key);
        if (!Number.isNaN(year)) {
          years.add(year);
        }
      }
    }
    return Array.from(years)
      .sort((a, b) => a - b)
      .map((year) => ({ year, label: `FY${String(year).slice(-2)}` }));
  }, [budget]);

/**
 * The Category-3 account name that carries the manually-entered admin fee.
 * Kept in sync with cord-api-v3's `ADMIN_FEE_ACCOUNT`
 * (`budget-calculation.service.ts`).
 */
export const ADMIN_FEE_ACCOUNT = 'Project Administration Fee';

/** Category-2 accounts -- managing-org supporting services. */
export const SERVICE_ACCOUNTS = [
  'Financial Services',
  'HR Services',
  'IT Services',
  'Program Mgt Support',
] as const;

/**
 * Ported from the prototype's `catOf()` (src/app.js). Purely client-side
 * categorisation used by the Breakdown tab -- the calc engine doesn't expose
 * a per-line category today, only the aggregated cash/inKind/admin totals.
 */
export const catOf = (account: string | null | undefined): string => {
  if (!account) return '';
  if (account === ADMIN_FEE_ACCOUNT) return 'Category 3';
  if ((SERVICE_ACCOUNTS as readonly string[]).includes(account)) {
    return 'Category 2';
  }
  return 'Category 1';
};

/**
 * A later phase adds a `type` field (line vs. header) to `BudgetLineItem`
 * once the backend's line-item type/position work lands (see this pass's
 * task notes). Nothing selects `type` today, so this is a no-op guard until
 * then -- but it costs nothing to have in place now, and the Breakdown /
 * Partner-Budgets tabs call it defensively before grouping lines.
 */
export const isHeaderLine = (line: object): boolean =>
  (line as { type?: string }).type === 'header';
