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
import { sortBy } from '@seedcompany/common';
import { useMemo, useState } from 'react';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import {
  amountForYear,
  Budget,
  getAmounts,
  getSecuredValue,
  isHeaderLine,
  useFiscalYearColumns,
} from './budgetLineHelpers';
import { BudgetLineItemFragment as BudgetLineItem } from './BudgetLineItem.graphql';

interface BudgetPartnerLedgerProps {
  budget: Budget | undefined;
}

// budget-line-items-poc (item 6): bucket titles/order match the prototype's
// `renderPartners()` (src/app.js) exactly.
const BUCKET_TITLES = [
  'Cash field-budget expenses',
  'Direct charges to funder',
  'In-kind expenses',
] as const;
type BucketTitle = (typeof BUCKET_TITLES)[number];

const bucketFor = (line: BudgetLineItem): BucketTitle => {
  if (getSecuredValue(line.costType) === 'In-Kind') {
    return 'In-kind expenses';
  }
  if (getSecuredValue(line.budgetCategory) === 'Direct Charge to Funder') {
    return 'Direct charges to funder';
  }
  return 'Cash field-budget expenses';
};

/**
 * budget-line-items-poc (item 6): the "Partner Budgets" tab -- a
 * per-service-provider ledger, computed entirely client-side from
 * `budget.lineItems` (no backend call). Ported from the prototype's
 * `renderPartners()`.
 */
export const BudgetPartnerLedger = ({ budget }: BudgetPartnerLedgerProps) => {
  const formatCurrency = useCurrencyFormatter({ maximumFractionDigits: 2 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fiscalYearColumns = useFiscalYearColumns(budget);

  const providers = useMemo(() => {
    const byId = new Map<string, string>();
    for (const line of budget?.lineItems ?? []) {
      if (isHeaderLine(line)) continue;
      const org = line.serviceProvider.value;
      if (org) byId.set(org.id, org.name.value ?? org.id);
    }
    return sortBy(
      Array.from(byId, ([id, name]) => ({ id, name })),
      (o) => o.name
    );
  }, [budget]);

  const providerId = providers.some((p) => p.id === selectedId)
    ? selectedId
    : providers[0]?.id ?? null;

  const lines = useMemo(
    () =>
      (budget?.lineItems ?? []).filter(
        (line) =>
          !isHeaderLine(line) && line.serviceProvider.value?.id === providerId
      ),
    [budget, providerId]
  );

  const buckets = useMemo(() => {
    const result = new Map<BucketTitle, Map<string, number[]>>(
      BUCKET_TITLES.map((title) => [title, new Map<string, number[]>()])
    );
    for (const line of lines) {
      const bucket = result.get(bucketFor(line))!;
      const key = getSecuredValue(line.account) || '(blank)';
      const amounts = getAmounts(line.fiscalYearAmounts);
      const totals = bucket.get(key) ?? fiscalYearColumns.map(() => 0);
      fiscalYearColumns.forEach((fy, i) => {
        totals[i] = (totals[i] ?? 0) + amountForYear(amounts, fy.year);
      });
      bucket.set(key, totals);
    }
    return result;
  }, [lines, fiscalYearColumns]);

  const funding = useMemo(() => {
    const totals = fiscalYearColumns.map(() => 0);
    let provides = false;
    for (const line of budget?.lineItems ?? []) {
      if (isHeaderLine(line) || line.funder.value?.id !== providerId) continue;
      provides = true;
      const amounts = getAmounts(line.fiscalYearAmounts);
      fiscalYearColumns.forEach((fy, i) => {
        totals[i] = (totals[i] ?? 0) + amountForYear(amounts, fy.year);
      });
    }
    const sum = totals.reduce((a, b) => a + b, 0);
    return provides && sum !== 0 ? totals : null;
  }, [budget, providerId, fiscalYearColumns]);

  if (!budget || fiscalYearColumns.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography color="text.secondary">
            Set the project&apos;s dates and add lines first to see partner
            budgets.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (providers.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography color="text.secondary">
            No service providers set yet. Set the Service Provider column on
            budget lines to build partner budgets.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const anyData =
    Array.from(buckets.values()).some((g) => g.size > 0) || funding != null;

  return (
    <Stack spacing={2}>
      <TextField
        select
        label="Service provider"
        value={providerId ?? ''}
        onChange={(e) => setSelectedId(e.target.value)}
        sx={{ maxWidth: 320 }}
        size="small"
      >
        {providers.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.name}
          </MenuItem>
        ))}
      </TextField>

      {!anyData ? (
        <Typography color="text.secondary">
          No budget lines for this provider.
        </Typography>
      ) : (
        <>
          {BUCKET_TITLES.map((title) => {
            const group = buckets.get(title)!;
            if (group.size === 0) return null;
            const keys = Array.from(group.keys()).sort((a, b) =>
              a.localeCompare(b)
            );
            const subtotal = fiscalYearColumns.map((_, i) =>
              keys.reduce((sum, key) => sum + (group.get(key)?.[i] ?? 0), 0)
            );
            return (
              <Card variant="outlined" key={title}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {title}
                  </Typography>
                  <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Account</TableCell>
                          {fiscalYearColumns.map((fy) => (
                            <TableCell key={fy.year} align="right">
                              {fy.label}
                            </TableCell>
                          ))}
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {keys.map((key) => {
                          const values = group.get(key) ?? [];
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
                            </TableRow>
                          );
                        })}
                        <TableRow
                          sx={{
                            '& .MuiTableCell-root': { fontWeight: 700 },
                          }}
                        >
                          <TableCell>Subtotal</TableCell>
                          {subtotal.map((v, i) => (
                            <TableCell
                              key={fiscalYearColumns[i]!.year}
                              align="right"
                            >
                              {formatCurrency(v)}
                            </TableCell>
                          ))}
                          <TableCell align="right">
                            {formatCurrency(
                              subtotal.reduce((a, b) => a + b, 0)
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            );
          })}

          {funding ? (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Funding provided by{' '}
                  {providers.find((p) => p.id === providerId)?.name}
                </Typography>
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Total funded</TableCell>
                        {funding.map((v, i) => (
                          <TableCell
                            key={fiscalYearColumns[i]!.year}
                            align="right"
                          >
                            {formatCurrency(v)}
                          </TableCell>
                        ))}
                        <TableCell align="right">
                          {formatCurrency(funding.reduce((a, b) => a + b, 0))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </Stack>
  );
};
