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
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { Budget } from './budgetLineHelpers';

interface BudgetSummaryPanelProps {
  budget: Budget | undefined;
  /** Best-effort primary-funder name, for the "Total cash — {funder}" stats
   * row. Null when `project.primaryPartnership` isn't resolvable yet (see
   * `ProjectBudget.graphql`'s comment) -- falls back to a generic label. */
  funderName?: string | null;
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

// budget-line-items-poc (item 4): row order/labels match the prototype's
// `renderSummary()` (src/app.js) exactly. Each key exists on both
// `BudgetCalculationFiscalYear` (per-FY value) and `BudgetCalculationTotals`
// (already-aggregated total), so the same row definition drives both.
type StatKey =
  | 'cash'
  | 'inKind'
  | 'admin'
  | 'grandTotal'
  | 'totalCash'
  | 'otherPartnerContributions'
  | 'netToFunder';

/**
 * budget-line-items-poc: renders `Budget.calculationSummary` as plain MUI
 * cards -- grand total, Bible-Translation %, funder Bible-Translation %,
 * cost per language -- plus the Budget Approval Stats table (one row per
 * fiscal year, matching the prototype's stats table) and an admin-fee-cap
 * note.
 */
export const BudgetSummaryPanel = ({
  budget,
  funderName,
}: BudgetSummaryPanelProps) => {
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

  const cards = [
    {
      label: 'Grand Total',
      value: formatCurrency(summary.totals.grandTotal),
    },
    {
      label: 'Bible Translation %',
      value: formatPercent(summary.bibleTranslationPercent),
    },
    {
      label: 'Funder Bible Translation %',
      value: formatPercent(summary.funderBibleTranslationPercent),
    },
    {
      label: 'Cost Per Language',
      value: formatCurrency(summary.costPerLanguage),
    },
  ];

  const adminFeeCapNote =
    summary.totals.adminFeeCap == null
      ? "No admin-fee cap configured for this budget's country."
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

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid item xs={6} sm={3} key={card.label}>
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="overline"
                color="text.secondary"
                component="div"
              >
                {card.label}
              </Typography>
              <Typography variant="h5">{card.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
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
                          {formatCurrency(fy[row.key])}
                        </TableCell>
                      ))}
                      <TableCell align="right">
                        {formatCurrency(summary.totals[row.key])}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary">
          {adminFeeCapNote}
        </Typography>
      </Grid>
    </Grid>
  );
};
