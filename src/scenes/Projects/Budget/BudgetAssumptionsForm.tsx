import { useMutation, useQuery } from '@apollo/client';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useMemo } from 'react';
import { UpdateBudget as UpdateBudgetInput } from '~/api/schema.graphql';
import {
  Form,
  NumberField,
  SecuredField,
  SelectField,
} from '../../../components/form';
import { BudgetReferenceCountriesDocument } from './BudgetReferenceCountry.graphql';
import {
  ProjectBudgetQuery,
  UpdateBudgetAssumptionsDocument,
} from './ProjectBudget.graphql';

type Budget = NonNullable<
  NonNullable<ProjectBudgetQuery['project']['budget']>['value']
>;

interface BudgetAssumptionsFormProps {
  budget: Budget;
}

const CURRENCY_MODES = ['USD', 'Local'] as const;

/**
 * budget-line-items-poc: new fields on the Budget page for country,
 * currency modes, exchange rate, inflation rate, admin fee percent, and
 * language count. These live on `Budget` (not `Project`), so this is a new
 * form section on the Budget page rather than an addition to a pre-existing
 * "project assumptions" area (no such area exists in this codebase today --
 * see the frontend report for this deviation).
 */
export const BudgetAssumptionsForm = ({
  budget,
}: BudgetAssumptionsFormProps) => {
  const [updateBudget] = useMutation(UpdateBudgetAssumptionsDocument);
  const { data: countriesData } = useQuery(BudgetReferenceCountriesDocument);
  const countries = useMemo(
    () => countriesData?.budgetReferenceCountries ?? [],
    [countriesData]
  );
  const countryLabels = useMemo(
    () => new Map(countries.map((country) => [country.id, country.name])),
    [countries]
  );

  const initialValues = useMemo(
    () => ({
      id: budget.id,
      country: budget.country.value?.id ?? null,
      entryCurrencyMode: budget.entryCurrencyMode.value,
      displayCurrencyMode: budget.displayCurrencyMode.value,
      exchangeRate: budget.exchangeRate.value,
      inflationRate: budget.inflationRate.value,
      adminFeePercent: budget.adminFeePercent.value,
      languageCount: budget.languageCount.value,
    }),
    [budget]
  );

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Assumptions
        </Typography>
        <Form<UpdateBudgetInput>
          initialValues={initialValues}
          onSubmit={async (input) => {
            await updateBudget({ variables: { input } });
          }}
          autoSubmit
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <SecuredField obj={budget} name="country">
                {(props) => (
                  <SelectField
                    {...props}
                    label="Country"
                    fullWidth
                    defaultOption="None"
                    options={countries.map((country) => country.id)}
                    getOptionLabel={(id) => countryLabels.get(id) ?? id}
                  />
                )}
              </SecuredField>
            </Grid>
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
            <Grid item xs={6} sm={3} md={2}>
              <SecuredField obj={budget} name="languageCount">
                {(props) => (
                  <NumberField {...props} label="Language Count" fullWidth />
                )}
              </SecuredField>
            </Grid>
          </Grid>
        </Form>
      </CardContent>
    </Card>
  );
};
