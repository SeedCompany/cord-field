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
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { onUpdateInvalidateProps } from '~/api';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { BudgetBenchmarkDocument } from './BudgetBenchmark.graphql';
import {
  Budget,
  CONSULTANT_ACCOUNT,
  CONSULTANT_TYPES,
  DEFAULT_CONSULTANT_TYPE,
  SALARY_ACCOUNTS,
  useFiscalYearColumns,
} from './budgetLineHelpers';
import {
  BudgetLineItemFragment as BudgetLineItem,
  UpdateBudgetLineItemDocument,
} from './BudgetLineItem.graphql';

export interface BudgetLineItemCalculatorDialogProps {
  open: boolean;
  onClose: () => void;
  TransitionProps?: DialogProps['TransitionProps'];
  budget: Budget;
  lineItem: BudgetLineItem | undefined;
}

/**
 * budget-line-items-poc (item 2): the benchmark/keystone calculator modal --
 * ported from the prototype's `openCalc()` / `drawModal()` /
 * `resolveCalcParams()` / `previewKeystone()` / `applyModal()` (src/app.js),
 * but backed by the real `budgetBenchmark` GraphQL query instead of
 * client-side reference data (the prototype's `REF.countries`) -- the server
 * always resolves the budget's real country (see `Budget.country`); there's
 * no transient client-side country picker like the prototype's
 * `countryPickBlock()`, since sensitivity masking here is purely a display
 * decision (the query itself is never masked -- see `BudgetBenchmarkResult`'s
 * doc comment on the backend).
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

  const account = lineItem?.account.value ?? '';
  const isConsultant = account === CONSULTANT_ACCOUNT;
  const isSalary = (SALARY_ACCOUNTS as readonly string[]).includes(account);

  const [consultantType, setConsultantType] = useState<string>(
    DEFAULT_CONSULTANT_TYPE
  );
  const [weeks, setWeeks] = useState<number[]>([]);

  // Reset local inputs whenever a (new) line item's dialog is opened.
  useEffect(() => {
    if (open) {
      setConsultantType(DEFAULT_CONSULTANT_TYPE);
      setWeeks(fiscalYearColumns.map(() => 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lineItem?.id]);

  const variables = useMemo(
    () => ({
      input: {
        budget: budget.id,
        account,
        consultantType: isConsultant ? consultantType : undefined,
        weeksPerFiscalYear: isSalary ? weeks : undefined,
      },
    }),
    [budget.id, account, isConsultant, consultantType, isSalary, weeks]
  );

  const { data, loading } = useQuery(BudgetBenchmarkDocument, {
    variables,
    skip: !open || !lineItem || !account,
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

  const handleApply = async () => {
    if (!lineItem || !result) {
      return;
    }
    await updateLineItem({
      variables: {
        input: { id: lineItem.id, fiscalYearAmounts: result.fiscalYearAmounts },
      },
    });
    onClose();
  };

  const figureLine = loading
    ? 'Calculating…'
    : !result
    ? "Can't compute a benchmark for this line yet — check that the project has start/end dates, a resolvable country, and a seeded keystone rate for this role."
    : isHighSensitivity
    ? 'Benchmark figure computed. Rate hidden at High sensitivity.'
    : `Benchmark figure: ${formatCurrency(result.weeklyOrAnnualFigure)} ${
        isSalary ? '/ week' : 'annual'
      }`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={TransitionProps}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        Benchmark calculator{account ? ` — ${account}` : ''}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
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
              Service benchmark is annual, multiplied by number of languages (
              {budget.languageCount.value ?? 1}).
            </Typography>
          )}

          <Alert severity={!loading && !result ? 'warning' : 'info'}>
            {figureLine}
          </Alert>
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
