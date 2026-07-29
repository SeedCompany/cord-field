import {
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { asDate, CalendarDateOrISO, Nullable } from '~/common';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { Budget } from './budgetLineHelpers';

interface BudgetApprovalStatsTabProps {
  budget: Budget | undefined;
  /** Best-effort primary-funder name, for the "Total cash — {funder}" stats
   * row. Null when `project.primaryPartnership` isn't resolvable yet (see
   * `ProjectBudget.graphql`'s comment) -- falls back to a generic label. */
  funderName?: string | null;
  /** The project's MOU dates -- read-only, sourced from `ProjectBudget.tsx`
   * (see that file's comment on `projectMouStart`/`projectMouEnd`) -- used
   * for the "Project Length" line below. */
  projectMouStart: Nullable<CalendarDateOrISO>;
  projectMouEnd: Nullable<CalendarDateOrISO>;
}

// budget-line-items-poc: row order/labels match the prototype's
// `renderSummary()` (src/app.js) exactly, plus a trailing `adminFeeCap` row
// added once this became its own tab. Each key exists on both
// `BudgetCalculationFiscalYear` (per-FY value) and `BudgetCalculationTotals`
// (already-aggregated total), so the same row definition drives both.
type StatKey =
  | 'cash'
  | 'inKind'
  | 'admin'
  | 'adminFeeCap'
  | 'grandTotal'
  | 'totalCash'
  | 'otherPartnerContributions'
  | 'netToFunder';

/**
 * budget-line-items-poc: the "Budget Approval Stats" outer tab -- renders
 * `Budget.calculationSummary` as a Project Length summary plus a stats table
 * (one row per fiscal year, matching the prototype's stats table) and an
 * admin-fee-cap note. Previously a sub-panel of the "Field Budget" tab named
 * `BudgetSummaryPanel`; promoted to its own top-level tab (and renamed) once
 * it stopped sharing that tab with the line-item grids. The grand-total/
 * Bible-Translation %/cost-per-language stat cards that used to sit above
 * this table live in the always-visible page header instead (see
 * ProjectBudget.tsx).
 */
export const BudgetApprovalStatsTab = ({
  budget,
  funderName,
  projectMouStart,
  projectMouEnd,
}: BudgetApprovalStatsTabProps) => {
  const formatCurrency = useCurrencyFormatter();
  const summary = budget?.calculationSummary;

  if (!budget) {
    return null;
  }

  if (!summary) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography color="text.secondary">
            Set the project&apos;s start and end dates to see budget
            calculations.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // budget-line-items-poc: months between the project's MOU dates, via the
  // same Luxon-backed `CalendarDate` used everywhere else in the app for
  // date math (see `~/common/CalenderDate`'s `asDate`) -- no new date
  // library added for this.
  const start = asDate(projectMouStart);
  const end = asDate(projectMouEnd);
  const projectLengthMonths =
    start && end ? Math.round(end.diff(start, 'months').months) : null;

  // budget-line-items-poc: the fiscal-year range the calc engine actually
  // covers, derived from `calculationSummary.fiscalYears`'s first/last
  // entries -- already ordered chronologically, the same order the stats
  // table below displays them in.
  const firstFiscalYear = summary.fiscalYears[0];
  const lastFiscalYear = summary.fiscalYears[summary.fiscalYears.length - 1];
  const fiscalYearRangeLabel =
    firstFiscalYear && lastFiscalYear
      ? firstFiscalYear.fiscalYear === lastFiscalYear.fiscalYear
        ? firstFiscalYear.label
        : `${firstFiscalYear.label} – ${lastFiscalYear.label}`
      : null;

  // budget-line-items-poc: the admin-fee-cap note/row is only meaningful
  // when the budget actually charges an admin fee -- matching the
  // prototype's `S.adminpct>0` guard (app.js `renderSummary()`, lines
  // ~410-412). Without this, the note/row would render (e.g. "no cap
  // configured") for budgets that never apply an admin fee at all, which is
  // the audit's "shows even when meaningless" finding.
  const adminFeePercentValue = budget.adminFeePercent.value;
  const hasAdminFeePercent =
    typeof adminFeePercentValue === 'number' && adminFeePercentValue > 0;

  // budget-line-items-poc: High-sensitivity masking, ported from the
  // prototype's cap-note suppression (app.js `renderSummary()`, lines
  // ~400-408: "Country-specific cap figures are suppressed at High
  // sensitivity"). Frontend-only display convention -- see this file's
  // header comment and the honest-scope note in ProjectBudget.tsx.
  const isHighSensitivity = budget.sensitivity === 'High';

  const adminFeeCapNote = !hasAdminFeePercent
    ? null
    : summary.totals.adminFeeCap == null
    ? "No admin-fee cap configured for this budget's country."
    : isHighSensitivity
    ? summary.capped
      ? 'Admin fee capped in at least one fiscal year. Cap figures are private at High sensitivity.'
      : 'Admin fee cap: not reached. Cap figures are private at High sensitivity.'
    : summary.capped
    ? `Admin fee capped at ${formatCurrency(
        summary.totals.adminFeeCap
      )} in at least one fiscal year.`
    : `Admin fee cap: ${formatCurrency(
        summary.totals.adminFeeCap
      )} (not reached).`;

  const funderLabel = funderName?.trim() ? funderName : 'Primary Funder';
  const statsRows: Array<{
    label: string;
    key: StatKey;
    emphasize?: boolean;
  }> = [
    { label: 'Cash costs (Cat 1 & 2)', key: 'cash' },
    { label: 'In-kind costs (Cat 1 & 2)', key: 'inKind' },
    { label: 'Managing org. supporting costs (Cat 3)', key: 'admin' },
    // budget-line-items-poc: can be null -- "no cap configured for this
    // budget's country" -- see `formatStat`'s null-handling below, matching
    // `adminFeeCapNote`'s own wording/spirit for that same case. Only shown
    // at all when `hasAdminFeePercent`, matching the note above.
    ...(hasAdminFeePercent
      ? [{ label: 'Admin fee cap (Cat 3)', key: 'adminFeeCap' as StatKey }]
      : []),
    {
      label: 'Grand total — cash & in-kind',
      key: 'grandTotal',
      emphasize: true,
    },
    { label: 'Total cash costs', key: 'totalCash' },
    {
      label: 'Other partner cash contributions',
      key: 'otherPartnerContributions',
    },
    { label: `Total cash — ${funderLabel}`, key: 'netToFunder' },
  ];

  // budget-line-items-poc: only the `adminFeeCap` row can actually be null
  // (every other `StatKey` is always a number) -- one shared null-check
  // covers it without needing to special-case the key here. At High
  // sensitivity, the `adminFeeCap` row's dollar figures are additionally
  // replaced with a non-numeric "Capped"/"Not reached" indicator (matching
  // `adminFeeCapNote`'s masking above) -- there's no per-fiscal-year capped
  // flag from the calc engine, only the whole-budget `summary.capped`, so
  // that single flag is reused for every fiscal-year cell and the total,
  // same granularity the prototype itself ever tracked.
  const formatStat = (key: StatKey, value: number | null | undefined) => {
    if (value == null) return '—';
    if (key === 'adminFeeCap' && isHighSensitivity) {
      return summary.capped ? 'Capped' : 'Not reached';
    }
    return formatCurrency(value);
  };

  return (
    <Grid container spacing={2} direction="column">
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          Project Length:{' '}
          {projectLengthMonths != null ? `${projectLengthMonths} months` : '—'}
          {fiscalYearRangeLabel ? ` (${fiscalYearRangeLabel})` : ''}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Budget Approval Stats
            </Typography>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Line</TableCell>
                    {summary.fiscalYears.map((fy) => (
                      <TableCell key={fy.fiscalYear} align="right">
                        {fy.label}
                      </TableCell>
                    ))}
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statsRows.map((row) => (
                    <TableRow
                      key={row.key}
                      sx={
                        row.emphasize
                          ? {
                              '& .MuiTableCell-root': {
                                fontWeight: 700,
                                borderTop: '2px solid',
                                borderTopColor: 'divider',
                              },
                            }
                          : undefined
                      }
                    >
                      <TableCell>{row.label}</TableCell>
                      {summary.fiscalYears.map((fy) => (
                        <TableCell key={fy.fiscalYear} align="right">
                          {formatStat(row.key, fy[row.key])}
                        </TableCell>
                      ))}
                      <TableCell align="right">
                        {formatStat(row.key, summary.totals[row.key])}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
      {adminFeeCapNote ? (
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            {adminFeeCapNote}
          </Typography>
        </Grid>
      ) : null}
    </Grid>
  );
};
