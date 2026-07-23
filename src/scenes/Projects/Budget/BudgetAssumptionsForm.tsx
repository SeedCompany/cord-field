import { useMutation } from '@apollo/client';
import {
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { UpdateBudget as UpdateBudgetInput } from '~/api/schema.graphql';
import { CalendarDateOrISO, Nullable } from '~/common';
import {
  Form,
  NumberField,
  SecuredField,
  SelectField,
} from '../../../components/form';
import { FormattedDateRange } from '../../../components/Formatters/FormattedDate';
import { Budget } from './budgetLineHelpers';
import { UpdateBudgetAssumptionsDocument } from './ProjectBudget.graphql';

interface BudgetAssumptionsFormProps {
  budget: Budget;
  /** budget-line-items-poc (item 7): the *project's* MOU dates, shown
   * read-only here for context -- distinct from any budget-specific field
   * (this Budget resource has no dates of its own; fiscal years are derived
   * from the project's mouStart/mouEnd). */
  projectMouStart?: Nullable<CalendarDateOrISO>;
  projectMouEnd?: Nullable<CalendarDateOrISO>;
}

const CURRENCY_MODES = ['USD', 'Local'] as const;

/**
 * budget-line-items-poc: new fields on the Budget page for country,
 * currency modes, exchange rate, inflation rate, admin fee percent, and
 * language count. These live on `Budget` (not `Project`), so this is a new
 * form section on the Budget page rather than an addition to a pre-existing
 * "project assumptions" area -- no such area exists in this codebase today.
 */
export const BudgetAssumptionsForm = ({
  budget,
  projectMouStart,
  projectMouEnd,
}: BudgetAssumptionsFormProps) => {
  const [updateBudget] = useMutation(UpdateBudgetAssumptionsDocument);

  // budget-line-items-poc (item 3): `country` and `languageCount` are no
  // longer part of this form -- both are purely server-derived now (see
  // `Budget.country`/`Budget.languageCount`'s doc comments) and were removed
  // from `UpdateBudget` entirely, so they're intentionally absent from
  // `initialValues` (an auto-submitting `Form` sends whatever's in `values`,
  // and neither key exists on the input type anymore). They're rendered as
  // plain read-only displays below instead.
  const initialValues = useMemo(
    () => ({
      id: budget.id,
      entryCurrencyMode: budget.entryCurrencyMode.value,
      displayCurrencyMode: budget.displayCurrencyMode.value,
      exchangeRate: budget.exchangeRate.value,
      inflationRate: budget.inflationRate.value,
      adminFeePercent: budget.adminFeePercent.value,
    }),
    [budget]
  );

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Assumptions
        </Typography>
        {projectMouStart || projectMouEnd ? (
          <>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Project Dates (MOU):{' '}
              <FormattedDateRange start={projectMouStart} end={projectMouEnd} />
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </>
        ) : null}
        <Form<UpdateBudgetInput>
          initialValues={initialValues}
          onSubmit={async (input) => {
            await updateBudget({ variables: { input } });
          }}
          autoSubmit
        >
          <Grid container spacing={2}>
            {budget.country.canRead ? (
              <Grid item xs={12} sm={6} md={4}>
                {/* budget-line-items-poc (item 3): read-only now -- Country
                    is purely derived from the project's Primary Location and
                    was removed from UpdateBudget entirely (see this
                    component's earlier comment). */}
                <TextField
                  label="Country"
                  value={
                    budget.country.value?.name ??
                    "Set the project's Primary Location (as a Country-type " +
                      'location) to enable country-specific calculations'
                  }
                  helperText="From the project's Primary Location"
                  fullWidth
                  multiline={!budget.country.value}
                  InputProps={{ readOnly: true }}
                  sx={
                    !budget.country.value
                      ? { '& .MuiInputBase-input': { color: 'text.secondary' } }
                      : undefined
                  }
                />
              </Grid>
            ) : null}
            <Grid item xs={6} sm={3} md={2}>
              <SecuredField obj={budget} name="entryCurrencyMode">
                {(props) => (
                  <SelectField
                    {...props}
                    label="Entry Currency"
                    fullWidth
                    options={CURRENCY_MODES}
                  />
                )}
              </SecuredField>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <SecuredField obj={budget} name="displayCurrencyMode">
                {(props) => (
                  <SelectField
                    {...props}
                    label="Display Currency"
                    fullWidth
                    options={CURRENCY_MODES}
                  />
                )}
              </SecuredField>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <SecuredField obj={budget} name="exchangeRate">
                {(props) => (
                  <NumberField
                    {...props}
                    label="Exchange Rate"
                    fullWidth
                    maximumFractionDigits={4}
                    helperText="Local currency per USD"
                  />
                )}
              </SecuredField>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <SecuredField obj={budget} name="inflationRate">
                {(props) => (
                  <NumberField
                    {...props}
                    label="Inflation Rate"
                    fullWidth
                    maximumFractionDigits={4}
                    helperText="e.g. 0.03 for 3%"
                  />
                )}
              </SecuredField>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <SecuredField obj={budget} name="adminFeePercent">
                {(props) => (
                  <NumberField
                    {...props}
                    label="Admin Fee Percent"
                    fullWidth
                    maximumFractionDigits={4}
                    helperText="e.g. 0.1 for 10%"
                  />
                )}
              </SecuredField>
            </Grid>
            {budget.languageCount.canRead ? (
              <Grid item xs={6} sm={3} md={2}>
                {/* budget-line-items-poc (item 3): read-only now -- see the
                    Country field above for why. */}
                <TextField
                  label="Language Count"
                  value={budget.languageCount.value ?? 0}
                  helperText="From the project's Language Engagements"
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            ) : null}
          </Grid>
        </Form>
      </CardContent>
    </Card>
  );
};
