import { useMutation } from '@apollo/client';
import { Stack } from '@mui/material';
import { useMemo } from 'react';
import { UpdateBudget as UpdateBudgetInput } from '~/api/schema.graphql';
import {
  Form,
  NumberField,
  SecuredField,
  SelectField,
} from '../../../components/form';
import { Budget } from './budgetLineHelpers';
import { UpdateBudgetAssumptionsDocument } from './ProjectBudget.graphql';

interface BudgetAssumptionsFieldsProps {
  budget: Budget;
}

const CURRENCY_MODES = ['USD', 'Local'] as const;
const FIELD_WIDTH = 132;

/**
 * budget-line-items-poc: the 5 editable Budget assumption fields (currency
 * modes, exchange rate, inflation rate, admin fee percent) -- relocated
 * from a standalone Card (formerly `BudgetAssumptionsForm`, now deleted)
 * into a compact row in the page's always-visible header, since these
 * apply regardless of which tab is active (same reasoning as the
 * Country/Currency facts next to them). `size="small"` + fixed narrow
 * widths (rather than `fullWidth` Grid items in a Card) keep this in scale
 * with a header row instead of a full form layout. `languageCount` is no
 * longer rendered here at all -- it's redundant with the header's existing
 * Language Engagements count (see `LanguageEngagementsSummary`).
 */
export const BudgetAssumptionsFields = ({
  budget,
}: BudgetAssumptionsFieldsProps) => {
  const [updateBudget] = useMutation(UpdateBudgetAssumptionsDocument);

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
    <Form<UpdateBudgetInput>
      initialValues={initialValues}
      onSubmit={async (input) => {
        await updateBudget({ variables: { input } });
      }}
      autoSubmit
    >
      <Stack
        direction="row"
        flexWrap="wrap"
        spacing={2}
        alignItems="flex-start"
      >
        <SecuredField obj={budget} name="entryCurrencyMode">
          {(props) => (
            <SelectField
              {...props}
              label="Entry Currency"
              size="small"
              sx={{ width: FIELD_WIDTH }}
              options={CURRENCY_MODES}
            />
          )}
        </SecuredField>
        <SecuredField obj={budget} name="displayCurrencyMode">
          {(props) => (
            <SelectField
              {...props}
              label="Display Currency"
              size="small"
              sx={{ width: FIELD_WIDTH }}
              options={CURRENCY_MODES}
            />
          )}
        </SecuredField>
        <SecuredField obj={budget} name="exchangeRate">
          {(props) => (
            <NumberField
              {...props}
              label="Exchange Rate"
              size="small"
              sx={{ width: FIELD_WIDTH }}
              maximumFractionDigits={4}
              helperText="Local per USD"
            />
          )}
        </SecuredField>
        <SecuredField obj={budget} name="inflationRate">
          {(props) => (
            <NumberField
              {...props}
              label="Inflation Rate"
              size="small"
              sx={{ width: FIELD_WIDTH }}
              maximumFractionDigits={4}
              helperText="e.g. 0.03 for 3%"
            />
          )}
        </SecuredField>
        <SecuredField obj={budget} name="adminFeePercent">
          {(props) => (
            <NumberField
              {...props}
              label="Admin Fee Percent"
              size="small"
              sx={{ width: FIELD_WIDTH }}
              maximumFractionDigits={4}
              helperText="e.g. 0.1 for 10% — capped by country"
            />
          )}
        </SecuredField>
      </Stack>
    </Form>
  );
};
