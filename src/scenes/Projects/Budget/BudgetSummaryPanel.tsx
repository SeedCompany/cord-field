import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { ProjectBudgetQuery } from './ProjectBudget.graphql';

type Budget = NonNullable<
  NonNullable<ProjectBudgetQuery['project']['budget']>['value']
>;

interface BudgetSummaryPanelProps {
  budget: Budget | undefined;
}

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

/**
 * budget-line-items-poc: renders `Budget.calculationSummary` as plain MUI
 * cards -- grand total, Bible-Translation %, funder Bible-Translation %,
 * cost per language, and an admin-fee-cap note.
 */
export const BudgetSummaryPanel = ({ budget }: BudgetSummaryPanelProps) => {
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
        <Typography variant="body2" color="text.secondary">
          {adminFeeCapNote}
        </Typography>
      </Grid>
    </Grid>
  );
};
