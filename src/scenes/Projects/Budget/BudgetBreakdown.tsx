import {
  Card,
  CardContent,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import {
  amountForYear,
  Budget,
  catOf,
  getAmounts,
  getSecuredValue,
  isHeaderLine,
  useFiscalYearColumns,
} from './budgetLineHelpers';
import { BudgetLineItemFragment as BudgetLineItem } from './BudgetLineItem.graphql';

interface BudgetBreakdownProps {
  budget: Budget | undefined;
}

type Dimension = 'cat' | 'acct' | 'costType' | 'activity' | 'funder';

const DIMENSIONS: ReadonlyArray<{ value: Dimension; label: string }> = [
  { value: 'cat', label: 'Category' },
  { value: 'acct', label: 'Account' },
  { value: 'costType', label: 'Cost Type' },
  { value: 'activity', label: 'Activity' },
  { value: 'funder', label: 'Funder' },
];

// budget-line-items-poc (item 5): ported from the prototype's
// `renderBreakdown()` (src/app.js) -- fallback labels for an unset dimension
// value match the prototype's wording exactly ("(uncategorised)" for
// Category, "(blank)" for everything else).
const groupKeyFor = (line: BudgetLineItem, dim: Dimension): string => {
  switch (dim) {
    case 'cat':
      return catOf(getSecuredValue(line.account)) || '(uncategorised)';
    case 'acct':
      return getSecuredValue(line.account) || '(blank)';
    case 'costType':
      return getSecuredValue(line.costType) || '(blank)';
    case 'activity':
      return getSecuredValue(line.activity) || '(blank)';
    case 'funder':
      return line.funder.value?.name.value || '(blank)';
  }
};

/**
 * budget-line-items-poc (item 5): the "Breakdown" tab -- groups
 * `budget.lineItems` by a selectable dimension, computed entirely
 * client-side (no backend call). Ported from the prototype's
 * `renderBreakdown()`.
 */
export const BudgetBreakdown = ({ budget }: BudgetBreakdownProps) => {
  const formatCurrency = useCurrencyFormatter({ maximumFractionDigits: 2 });
  const [dimension, setDimension] = useState<Dimension>('cat');
  const fiscalYearColumns = useFiscalYearColumns(budget);

  const groups = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const line of budget?.lineItems ?? []) {
      if (isHeaderLine(line)) {
        continue;
      }
      const key = groupKeyFor(line, dimension);
      const amounts = getAmounts(line.fiscalYearAmounts);
      const totals = map.get(key) ?? fiscalYearColumns.map(() => 0);
      fiscalYearColumns.forEach((fy, i) => {
        totals[i] = (totals[i] ?? 0) + amountForYear(amounts, fy.year);
      });
      map.set(key, totals);
    }
    return map;
  }, [budget, dimension, fiscalYearColumns]);

  const sortedKeys = useMemo(
    () => Array.from(groups.keys()).sort((a, b) => a.localeCompare(b)),
    [groups]
  );

  const grandByYear = useMemo(
    () =>
      fiscalYearColumns.map((_, i) =>
        sortedKeys.reduce((sum, key) => sum + (groups.get(key)?.[i] ?? 0), 0)
      ),
    [groups, sortedKeys, fiscalYearColumns]
  );
  const grandTotal = grandByYear.reduce((a, b) => a + b, 0) || 1;

  if (!budget || fiscalYearColumns.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography color="text.secondary">
            Set the project&apos;s dates and add lines first to see the
            breakdown.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      <TextField
        select
        label="Group by"
        value={dimension}
        onChange={(e) => setDimension(e.target.value as Dimension)}
        sx={{ maxWidth: 240 }}
        size="small"
      >
        {DIMENSIONS.map((d) => (
          <MenuItem key={d.value} value={d.value}>
            {d.label}
          </MenuItem>
        ))}
      </TextField>
      <Card variant="outlined">
        <CardContent>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    {DIMENSIONS.find((d) => d.value === dimension)?.label}
                  </TableCell>
                  {fiscalYearColumns.map((fy) => (
                    <TableCell key={fy.year} align="right">
                      {fy.label}
                    </TableCell>
                  ))}
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">% of total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedKeys.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={fiscalYearColumns.length + 3}
                      sx={{ color: 'text.secondary' }}
                    >
                      No budget lines yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedKeys.map((key) => {
                    const values = groups.get(key) ?? [];
                    const total = values.reduce((a, b) => a + b, 0);
                    return (
                      <TableRow key={key}>
                        <TableCell>{key}</TableCell>
                        {values.map((v, i) => (
                          <TableCell
                            key={fiscalYearColumns[i]!.year}
                            align="right"
                          >
                            {formatCurrency(v)}
                          </TableCell>
                        ))}
                        <TableCell align="right">
                          {formatCurrency(total)}
                        </TableCell>
                        <TableCell align="right">
                          {((total / grandTotal) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
                <TableRow
                  sx={{
                    '& .MuiTableCell-root': {
                      fontWeight: 700,
                      borderTop: '2px solid',
                      borderTopColor: 'divider',
                    },
                  }}
                >
                  <TableCell>Total</TableCell>
                  {grandByYear.map((v, i) => (
                    <TableCell key={fiscalYearColumns[i]!.year} align="right">
                      {formatCurrency(v)}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    {formatCurrency(grandByYear.reduce((a, b) => a + b, 0))}
                  </TableCell>
                  <TableCell align="right">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  );
};
