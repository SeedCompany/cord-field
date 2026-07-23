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
 * True if this line is a `header`-type row (a visual, description-only
 * section-divider -- `account` is null and it contributes nothing to any
 * calculated total). Backed by the real `BudgetLineItem.type` field now that
 * the backend's line-item type/position work has landed (budget-line-items-
 * poc phases 2/3). Structurally typed (rather than importing the generated
 * `BudgetLineItemFragment` type) so every caller -- the grid rows, the
 * Breakdown tab, the Partner-Budgets tab -- can pass either the full
 * fragment or a lighter shape without a circular import.
 */
export const isHeaderLine = (line: {
  type: { value?: string | null };
}): boolean => line.type.value === 'header';

/**
 * Salary accounts the benchmark/keystone calculator (item 2) can compute a
 * per-week rate for. Duplicated (not imported) from cord-api-v3's
 * `budget-calculation.service.ts` exports (`SALARY_ACCTS`) -- cord-field and
 * cord-api-v3 are separate repos/packages with no shared package for this
 * POC's reference-data constants, so this is a deliberate, disclosed
 * duplication. Keep in sync by hand if the backend's list ever changes.
 */
export const SALARY_ACCOUNTS = [
  'Salary/Stipend - Translator',
  'Salary/Stipend - Non Translator',
  'Salary/Stipend - Consultant',
] as const;

/**
 * The 7 accounts the benchmark/keystone calculator is relevant for -- the 3
 * `SALARY_ACCOUNTS` plus the 4 `SERVICE_ACCOUNTS` above. Duplicated from
 * cord-api-v3's `KEYSTONE_ACCTS` -- see `SALARY_ACCOUNTS`'s comment.
 */
export const KEYSTONE_ACCOUNTS = [
  ...SALARY_ACCOUNTS,
  ...SERVICE_ACCOUNTS,
] as const;

/** The one salary account with a consultant-subtype selector. Duplicated from cord-api-v3's `CONSULTANT_ACCOUNT`. */
export const CONSULTANT_ACCOUNT = 'Salary/Stipend - Consultant';

/** The 3 consultant sub-role labels. Duplicated from cord-api-v3's `ROLE_MAP` keys. */
export const CONSULTANT_TYPES = [
  'Sr. Translation Consultant',
  'Independent Translation Consultant',
  'Dependent Consultant (CiT)',
] as const;

/** Default consultant sub-role, matching the prototype's `<select>` default and cord-api-v3's `DEFAULT_CONSULTANT_TYPE`. */
export const DEFAULT_CONSULTANT_TYPE: (typeof CONSULTANT_TYPES)[number] =
  'Sr. Translation Consultant';
