import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { onUpdateInvalidateProps } from '~/api';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { BudgetBenchmarkDocument } from './BudgetBenchmark.graphql';
import {
  Budget,
  CONSULTANT_ACCOUNT,
  CONSULTANT_TYPES,
  DEFAULT_CONSULTANT_TYPE,
  KEYSTONE_ACCOUNTS,
  SALARY_ACCOUNTS,
  useFiscalYearColumns,
} from './budgetLineHelpers';
import {
  BudgetLineItemFragment as BudgetLineItem,
  UpdateBudgetLineItemDocument,
} from './BudgetLineItem.graphql';
import { BudgetReferenceCountriesDocument } from './BudgetReferenceCountry.graphql';

export interface BudgetLineItemCalculatorDialogProps {
  open: boolean;
  onClose: () => void;
  TransitionProps?: DialogProps['TransitionProps'];
  budget: Budget;
  lineItem: BudgetLineItem | undefined;
}

type CalcMode = 'keystone' | 'annual';

/**
 * budget-line-items-poc (item 2, extended by the calculator-gaps fix): the
 * benchmark/keystone calculator modal -- ported from the prototype's
 * `openCalc()` / `drawModal()` / `resolveCalcParams()` / `previewKeystone()`
 * / `applyModal()` (src/app.js), but backed by the real `budgetBenchmark`
 * GraphQL query instead of client-side reference data (the prototype's
 * `REF.countries`).
 *
 * Two modes, matching the prototype's mode toggle:
 * - "keystone" (labeled "Benchmark figures"): the country/role/keystone-rate
 *   lookup, only ever available for `KEYSTONE_ACCOUNTS`.
 * - "annual" (labeled "Spread an annual amount"): a flat annual figure
 *   spread across fiscal years via `BudgetBenchmarkInput.annualAmount`,
 *   available for ANY account. Non-keystone accounts open directly into
 *   this mode with no toggle shown at all, matching the prototype's
 *   `drawModal()` (the toggle only renders `if(canKey)`).
 *
 * Country override: unlike the prototype (whose `countryPickBlock()`
 * transient picker exists purely for its storage-level High-sensitivity
 * masking), this dialog's escape-hatch "Country for this calculation"
 * select exists for a different, non-sensitivity reason -- the budget's own
 * derived country (`Budget.country`) may simply not resolve (no project
 * country set, or no reference-country row matches it). It's shown whenever
 * that's the case, in keystone mode; selecting one passes `countryId` to
 * `budgetBenchmark` as a transient, per-calculation-only override, never
 * persisted to the budget. Sensitivity masking here remains purely a
 * display decision (see `isHighSensitivity` below) -- the query itself is
 * never masked, matching `BudgetBenchmarkResult`'s doc comment on the
 * backend.
 *
 * Deviates from the prototype's on-screen wording in one place: the
 * prototype always previews the weekly rate (even for service accounts,
 * where the annual figure is computed silently at apply-time). Our backend's
 * `weeklyOrAnnualFigure` is already the ANNUAL figure for the 4
 * `SERVICE_ACCOUNTS` (see `BudgetBenchmarkResult`'s doc comment) -- so this
 * dialog labels it "annual" for those accounts rather than reproducing the
 * prototype's weekly-rate wording, to stay honest about what's actually
 * being shown/applied.
 */
export const BudgetLineItemCalculatorDialog = ({
  open,
  onClose,
  TransitionProps,
  budget,
  lineItem,
}: BudgetLineItemCalculatorDialogProps) => {
  const formatCurrency = useCurrencyFormatter({ maximumFractionDigits: 2 });
  const fiscalYearColumns = useFiscalYearColumns(budget);
  const { enqueueSnackbar } = useSnackbar();

  const account = lineItem?.account.value ?? '';
  const isConsultant = account === CONSULTANT_ACCOUNT;
  const isSalary = (SALARY_ACCOUNTS as readonly string[]).includes(account);
  const isKeystoneAccount = (KEYSTONE_ACCOUNTS as readonly string[]).includes(
    account
  );

  const [mode, setMode] = useState<CalcMode>('annual');
  const [consultantType, setConsultantType] = useState<string>(
    DEFAULT_CONSULTANT_TYPE
  );
  const [weeks, setWeeks] = useState<number[]>([]);
  const [annualAmount, setAnnualAmount] = useState<number>(0);
  const [countryOverride, setCountryOverride] = useState<string>('');

  // Reset local inputs whenever a (new) line item's dialog is opened --
  // keystone-eligible accounts default into "keystone" mode, everything
  // else opens directly into "annual" mode with no toggle shown at all.
  useEffect(() => {
    if (open) {
      setMode(isKeystoneAccount ? 'keystone' : 'annual');
      setConsultantType(DEFAULT_CONSULTANT_TYPE);
      setWeeks(fiscalYearColumns.map(() => 0));
      setAnnualAmount(0);
      setCountryOverride('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lineItem?.id]);

  // budget-line-items-poc (calculator gaps fix): `Budget.calculationSummary`
  // is null exactly when the project's start/end dates aren't both set --
  // the same fiscal-year computation `budgetBenchmark` itself early-returns
  // null for (see `BudgetResolver.budgetBenchmark` on the backend). Reusing
  // it here lets the dialog show a precise "Set project dates first." guard
  // BEFORE ever calling the query, instead of lumping it into one generic
  // "can't compute" message.
  const hasProjectDates = !!budget.calculationSummary;

  // The budget's own server-derived country, if any (already fetched by
  // `ProjectBudget.graphql` via `Budget.country.value` -- see
  // `BudgetReferenceCountry.graphql`'s fragment).
  const resolvedCountryId = budget.country.value?.id ?? null;
  const showCountrySelect = mode === 'keystone' && !resolvedCountryId;
  const needsCountry = showCountrySelect && !countryOverride;

  const { data: countriesData } = useQuery(BudgetReferenceCountriesDocument, {
    skip: !open || !showCountrySelect,
  });
  const countryOptions = countriesData?.budgetReferenceCountries ?? [];

  const variables = useMemo(
    () => ({
      input: {
        budget: budget.id,
        account,
        consultantType:
          mode === 'keystone' && isConsultant ? consultantType : undefined,
        weeksPerFiscalYear: mode === 'keystone' && isSalary ? weeks : undefined,
        annualAmount: mode === 'annual' ? annualAmount : undefined,
        countryId:
          mode === 'keystone' && countryOverride ? countryOverride : undefined,
      },
    }),
    [
      budget.id,
      account,
      mode,
      isConsultant,
      consultantType,
      isSalary,
      weeks,
      annualAmount,
      countryOverride,
    ]
  );

  // Preconditions the dialog already knows will make `budgetBenchmark`
  // return null are checked before ever issuing the query -- see
  // `hasProjectDates`/`needsCountry` above -- so `loading` only ever
  // reflects an in-flight request that could plausibly succeed.
  const { data, loading } = useQuery(BudgetBenchmarkDocument, {
    variables,
    skip: !open || !lineItem || !account || !hasProjectDates || needsCountry,
    fetchPolicy: 'network-only',
  });
  const result = data?.budgetBenchmark ?? null;
  const isHighSensitivity = budget.sensitivity === 'High';

  const [updateLineItem, { loading: applying }] = useMutation(
    UpdateBudgetLineItemDocument,
    {
      update: onUpdateInvalidateProps(budget, 'calculationSummary'),
    }
  );

  /**
   * Ported from the prototype's `applyModal()` (src/app.js). Only that
   * function's keystone branch ever composes a line `Description` sentence
   * -- its annual-mode branch only fires a `commit(...)` toast, never
   * touching `ln.desc`. We port that same asymmetry: annual-mode Apply
   * below patches only `fiscalYearAmounts`, no description change.
   */
  const composeDescription = (): string | undefined => {
    if (!result || mode !== 'keystone') {
      return undefined;
    }
    if (isSalary) {
      const roleLabel = account.replace('Salary/Stipend - ', '');
      const parts = weeks
        .map((w, i) => `${w} weeks in ${fiscalYearColumns[i]?.label ?? ''}`)
        .filter((_, i) => (weeks[i] ?? 0) > 0);
      const sentence = `${roleLabel} — ${parts.join(', ')}`;
      return isHighSensitivity
        ? `${sentence}.`
        : `${sentence} at ${formatCurrency(
            result.weeklyOrAnnualFigure
          )} per week.`;
    }
    // Service accounts: `weeklyOrAnnualFigure` is already the ANNUAL total
    // (per-language figure × languageCount, see the doc comment above) --
    // back out the per-language figure using the same languageCount so the
    // sentence can match the prototype's "<rate> × <n> languages" wording.
    const languageCount = budget.languageCount.value ?? 1;
    const perLanguageFigure =
      result.weeklyOrAnnualFigure / (languageCount || 1);
    return isHighSensitivity
      ? `${account} benchmark.`
      : `${account} benchmark (${formatCurrency(
          perLanguageFigure
        )} × ${languageCount} languages).`;
  };

  const handleApply = async () => {
    if (!lineItem || !result) {
      return;
    }
    const description = composeDescription();
    await updateLineItem({
      variables: {
        input: {
          id: lineItem.id,
          fiscalYearAmounts: result.fiscalYearAmounts,
          ...(description !== undefined ? { description } : {}),
        },
      },
    });
    // budget-line-items-poc (audit polish): matches the prototype's
    // `commit("Benchmark figures applied"+...)` toast (src/app.js's
    // `applyModal()`). The "(rate hidden)" caveat mirrors the same
    // keystone-only masking condition as the on-screen figure line above --
    // in annual mode nothing was ever hidden, so the toast never claims it
    // was.
    const rateHidden = mode === 'keystone' && isHighSensitivity;
    enqueueSnackbar(
      rateHidden
        ? 'Benchmark figures applied (rate hidden).'
        : 'Benchmark figures applied.',
      { variant: 'success' }
    );
    onClose();
  };

  // budget-line-items-poc (calculator gaps fix): distinct guard messages per
  // precondition, matching the prototype's granularity as closely as this
  // dialog can actually distinguish --
  //   - "Set project dates first." <- `hasProjectDates` (see its own
  //     comment above for why this is a precise, not approximate, check).
  //   - "Select a country to run the benchmark." <- keystone mode, no
  //     resolved country AND no override picked yet.
  //   - a catch-all for every other null result. Honesty note: the backend
  //     collapses "country lacks a keystone mapping", "country lacks a
  //     cost-of-living index", and "no seeded rate for this role" into the
  //     same null (see `BudgetResolver.budgetBenchmark`) -- once dates and a
  //     country both check out here, this dialog has no way left to tell
  //     those three apart, so the message below deliberately covers all of
  //     them rather than overclaiming precision it doesn't have.
  const figureLine = !hasProjectDates
    ? 'Set project dates first.'
    : needsCountry
    ? 'Select a country to run the benchmark.'
    : loading
    ? 'Calculating…'
    : !result
    ? mode === 'keystone'
      ? 'No benchmark data is seeded for this role/country combination yet.'
      : "Can't compute this line yet — check the inputs above."
    : // budget-line-items-poc (calculator gaps fix): the "rate hidden"
    // masking only ever applies to the keystone path -- its figure is
    // derived from a private country-specific rate the user never typed
    // in. In annual mode the figure IS what the user just typed into the
    // "Annual amount" field above (still visible on screen), so there's
    // nothing left to hide; masking it there would be actively misleading.
    mode === 'keystone' && isHighSensitivity
    ? 'Benchmark figure computed. Rate hidden at High sensitivity.'
    : `Benchmark figure: ${formatCurrency(result.weeklyOrAnnualFigure)} ${
        mode === 'keystone' && isSalary ? '/ week' : 'annual'
      }`;
  const isWarning = !loading && (!hasProjectDates || needsCountry || !result);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={TransitionProps}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        {isKeystoneAccount
          ? `Benchmark calculator — ${account}`
          : 'Spread an annual amount'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {isKeystoneAccount ? (
            <ToggleButtonGroup
              size="small"
              exclusive
              fullWidth
              value={mode}
              onChange={(_, next: CalcMode | null) => {
                if (next) {
                  setMode(next);
                }
              }}
            >
              <ToggleButton value="keystone">Benchmark figures</ToggleButton>
              <ToggleButton value="annual">
                Spread an annual amount
              </ToggleButton>
            </ToggleButtonGroup>
          ) : null}

          {mode === 'annual' ? (
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                {`Enter one annual figure. It's prorated for the partial first and last fiscal years and compounded by the budget's inflation rate (${(
                  (budget.inflationRate.value ?? 0) * 100
                ).toFixed(1)}%).`}
              </Typography>
              <TextField
                label="Annual amount"
                type="number"
                size="small"
                value={annualAmount}
                onChange={(e) => setAnnualAmount(Number(e.target.value) || 0)}
                inputProps={{ min: 0 }}
              />
            </Stack>
          ) : (
            <>
              {isConsultant ? (
                <TextField
                  select
                  label="Consultant type"
                  value={consultantType}
                  onChange={(e) => setConsultantType(e.target.value)}
                  fullWidth
                  size="small"
                >
                  {CONSULTANT_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              ) : null}

              {showCountrySelect ? (
                <TextField
                  select
                  label="Country for this calculation"
                  value={countryOverride}
                  onChange={(e) => setCountryOverride(e.target.value)}
                  fullWidth
                  size="small"
                  helperText="This budget's country doesn't resolve -- pick one to use for just this calculation. Never saved to the budget."
                >
                  <MenuItem value="">
                    <em>— Select —</em>
                  </MenuItem>
                  {countryOptions.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              ) : null}

              {isSalary ? (
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Weeks of work in each fiscal year:
                  </Typography>
                  {fiscalYearColumns.map((fy, i) => (
                    <TextField
                      key={fy.year}
                      label={fy.label}
                      type="number"
                      size="small"
                      value={weeks[i] ?? 0}
                      onChange={(e) => {
                        const value = Number(e.target.value) || 0;
                        setWeeks((prev) => {
                          const next = [...prev];
                          next[i] = value;
                          return next;
                        });
                      }}
                      inputProps={{ min: 0, step: 0.5 }}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Service benchmark is annual, multiplied by number of languages
                  ({budget.languageCount.value ?? 1}).
                </Typography>
              )}
            </>
          )}

          <Alert severity={isWarning ? 'warning' : 'info'}>{figureLine}</Alert>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={!result || applying}
          onClick={() => void handleApply()}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};
