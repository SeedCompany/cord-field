import { useMutation } from '@apollo/client';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Card, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { DataGridPro as DataGrid, GridColDef } from '@mui/x-data-grid-pro';
import { sortBy } from '@seedcompany/common';
import { useMemo } from 'react';
import { invalidateProps, onUpdateInvalidateProps } from '~/api';
import { SecuredProp } from '~/common';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import {
  createAddItemFooter,
  EditNumberCell,
  enumColumn,
  isCellEditable,
  textColumn,
  useDataGridSlots,
} from '../../../components/Grid';
import {
  BudgetLineItemFragment as BudgetLineItem,
  CreateBudgetLineItemDocument,
  DeleteBudgetLineItemDocument,
  UpdateBudgetLineItemDocument,
} from './BudgetLineItem.graphql';
import { ProjectBudgetQuery } from './ProjectBudget.graphql';

type Budget = NonNullable<
  NonNullable<ProjectBudgetQuery['project']['budget']>['value']
>;

interface ProjectBudgetLineItemsProps {
  budget: Budget | undefined;
  loading: boolean;
}

type FiscalYearAmounts = Record<string, number>;

const getAmounts = (
  secured: SecuredProp<any>
): FiscalYearAmounts | null | undefined =>
  secured.value as FiscalYearAmounts | null | undefined;

const getSecuredValue = (secured: SecuredProp<any>) => secured.value;

// budget-line-items-poc: known values ported from the calc engine's
// regression fixture (cord-api-v3 budget-calculation.service.spec.ts /
// ADMIN_FEE_ACCOUNT) -- a placeholder chart-of-accounts list. A real
// reference-data admin UI for these is explicitly out of scope for this POC.
const ACCOUNTS = [
  'Salary/Stipend - Translator',
  'Salary/Stipend - Non Translator',
  'Travel Expense',
  'Meeting/Seminar Expense',
  'Printing',
  'Office Expense',
  'Financial Services',
  'IT Services',
  'Telecommunications',
  'Project Administration Fee',
] as const;
const labelsOf = (list: readonly string[]): Record<string, string> =>
  Object.fromEntries(list.map((item) => [item, item]));
const ACCOUNT_LABELS = labelsOf(ACCOUNTS);

const COST_TYPES = ['Cash', 'In-Kind'] as const;
const COST_TYPE_LABELS = labelsOf(COST_TYPES);

const BUDGET_CATEGORIES = ['Field Budget', 'Direct Charge to Funder'] as const;
const BUDGET_CATEGORY_LABELS = labelsOf(BUDGET_CATEGORIES);

const ACTIVITIES = ['Bible Translation', 'Other Costs'] as const;
const ACTIVITY_LABELS = labelsOf(ACTIVITIES);

interface FiscalYearColumn {
  year: number;
  label: string;
}

export const ProjectBudgetLineItems = (props: ProjectBudgetLineItemsProps) => {
  const { budget, loading } = props;
  const formatCurrency = useCurrencyFormatter({ maximumFractionDigits: 2 });

  // budget-line-items-poc: `lineItems`/`calculationSummary` are plain (not
  // paginated Connection-shaped) fields, so the `addItemToList`/
  // `removeItemFromList` cache helpers built for paginated lists don't apply
  // here. Simplest correct option: invalidate both fields so Apollo re-fetches
  // them from the network (the page's `@live` query already re-runs on
  // change; this just avoids a stale/incomplete render in the interim).
  const [createLineItem] = useMutation(CreateBudgetLineItemDocument, {
    update: budget
      ? onUpdateInvalidateProps(budget, 'lineItems', 'calculationSummary')
      : undefined,
  });

  const [updateLineItem] = useMutation(UpdateBudgetLineItemDocument, {
    update: budget
      ? onUpdateInvalidateProps(budget, 'calculationSummary')
      : undefined,
  });

  const [deleteLineItem] = useMutation(DeleteBudgetLineItemDocument);

  const fiscalYearColumns: readonly FiscalYearColumn[] = useMemo(() => {
    const fromSummary = budget?.calculationSummary?.fiscalYears.map((fy) => ({
      year: fy.fiscalYear,
      label: fy.label,
    }));
    if (fromSummary && fromSummary.length > 0) {
      return fromSummary;
    }
    // Fall back to whatever years already have data, when the project's
    // dates aren't set yet (calculationSummary is null in that case).
    const years = new Set<number>();
    for (const li of budget?.lineItems ?? []) {
      const amounts = getAmounts(li.fiscalYearAmounts);
      for (const key of Object.keys(amounts ?? {})) {
        const year = Number(key);
        if (!Number.isNaN(year)) {
          years.add(year);
        }
      }
    }
    return Array.from(years)
      .sort((a, b) => a - b)
      .map((year) => ({ year, label: `FY${String(year).slice(-2)}` }));
  }, [budget]);

  const rows = useMemo(
    () => sortBy(budget?.lineItems ?? [], (row) => row.createdAt),
    [budget]
  );

  const columns: Array<GridColDef<BudgetLineItem>> = useMemo(() => {
    const fyColumns: Array<GridColDef<BudgetLineItem>> = fiscalYearColumns.map(
      (fy): GridColDef<BudgetLineItem> => ({
        field: `fy_${fy.year}`,
        headerName: fy.label,
        description: `Fiscal Year ${fy.year} amount`,
        flex: 1,
        minWidth: 120,
        align: 'right',
        headerAlign: 'right',
        valueGetter: (_, row) =>
          getAmounts(row.fiscalYearAmounts)?.[String(fy.year)] ?? null,
        valueSetter: (value, row) => {
          const rawAmounts: FiscalYearAmounts = {
            ...(getAmounts(row.fiscalYearAmounts) ?? {}),
            [String(fy.year)]: value,
          };
          // The JSONObject scalar is a branded type at the TS level (see
          // ~/common#JsonObjectScalar); a plain object literal can never
          // structurally satisfy that brand, so this cast is unavoidable.
          const nextAmounts =
            rawAmounts as unknown as BudgetLineItem['fiscalYearAmounts']['value'];
          return {
            ...row,
            fiscalYearAmounts: { ...row.fiscalYearAmounts, value: nextAmounts },
          };
        },
        valueFormatter: (value: number | null) =>
          value != null ? formatCurrency(value) : '-',
        renderEditCell: (params) => <EditNumberCell {...params} />,
        editable: true,
        isEditable: ({ row }) => row.fiscalYearAmounts.canEdit,
      })
    );

    const handleDelete = (row: BudgetLineItem) => {
      void deleteLineItem({
        variables: { id: row.id },
        update: (cache, { data }) => {
          if (!data || !budget) {
            return;
          }
          invalidateProps(cache, budget, 'lineItems', 'calculationSummary');
          cache.evict({
            id: cache.identify({ __typename: 'BudgetLineItem', id: row.id }),
          });
          cache.gc();
        },
      });
    };

    const actionsCol: GridColDef<BudgetLineItem> = {
      field: 'actions',
      headerName: '',
      width: 60,
      align: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      renderCell: ({ row }) => (
        <Tooltip title="Delete Line Item">
          <span>
            <IconButton
              size="small"
              disabled={!row.canDelete}
              onClick={() => handleDelete(row)}
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </span>
        </Tooltip>
      ),
    };

    return [
      {
        field: 'description',
        headerName: 'Description',
        flex: 1.5,
        minWidth: 160,
        ...textColumn<BudgetLineItem>(),
        valueGetter: (_, row) => getSecuredValue(row.description),
        valueSetter: (value: string | null, row) => ({
          ...row,
          description: { ...row.description, value },
        }),
        editable: true,
        isEditable: ({ row }) => row.description.canEdit,
      },
      {
        field: 'account',
        headerName: 'Account',
        flex: 1,
        minWidth: 200,
        ...enumColumn(ACCOUNTS, ACCOUNT_LABELS),
        valueGetter: (_, row) => getSecuredValue(row.account),
        valueSetter: (value: string, row) => ({
          ...row,
          account: { ...row.account, value },
        }),
        editable: true,
        isEditable: ({ row }) => row.account.canEdit,
      },
      {
        field: 'costType',
        headerName: 'Cost Type',
        width: 120,
        ...enumColumn(COST_TYPES, COST_TYPE_LABELS),
        valueGetter: (_, row) => getSecuredValue(row.costType),
        valueSetter: (value: string, row) => ({
          ...row,
          costType: { ...row.costType, value },
        }),
        editable: true,
        isEditable: ({ row }) => row.costType.canEdit,
      },
      {
        field: 'budgetCategory',
        headerName: 'Budget Category',
        width: 190,
        ...enumColumn(BUDGET_CATEGORIES, BUDGET_CATEGORY_LABELS),
        valueGetter: (_, row) => getSecuredValue(row.budgetCategory),
        valueSetter: (value: string, row) => ({
          ...row,
          budgetCategory: { ...row.budgetCategory, value },
        }),
        editable: true,
        isEditable: ({ row }) => row.budgetCategory.canEdit,
      },
      {
        field: 'activity',
        headerName: 'Activity',
        width: 160,
        ...enumColumn(ACTIVITIES, ACTIVITY_LABELS),
        valueGetter: (_, row) => getSecuredValue(row.activity) ?? '',
        valueSetter: (value: string, row) => ({
          ...row,
          activity: { ...row.activity, value: value || null },
        }),
        editable: true,
        isEditable: ({ row }) => row.activity.canEdit,
      },
      ...fyColumns,
      actionsCol,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fiscalYearColumns, formatCurrency, deleteLineItem, budget]);

  const AddFooter = useMemo(
    () =>
      createAddItemFooter({
        label: 'Add Line Item',
        tooltipTitle: 'Add a new budget line item',
        addItem: () => {
          if (!budget) {
            return;
          }
          void createLineItem({
            variables: {
              input: {
                budget: budget.id,
                account: '',
              },
            },
          });
        },
      }),
    [budget, createLineItem]
  );

  const { slots, slotProps } = useDataGridSlots(
    {},
    { slots: { footer: AddFooter } }
  );

  const handleRowSave = async (
    row: BudgetLineItem,
    prev: BudgetLineItem
  ): Promise<BudgetLineItem> => {
    const changes = getChanges(prev, row);
    if (!changes) {
      return row;
    }
    await updateLineItem({ variables: { input: { id: row.id, ...changes } } });
    return row;
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h6">Line Items</Typography>
      {!budget?.calculationSummary && fiscalYearColumns.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Set the project&apos;s start and end dates to enable fiscal-year
          columns.
        </Typography>
      ) : null}
      <Card>
        <DataGrid<BudgetLineItem>
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          slots={slots}
          slotProps={slotProps}
          autoHeight
          disableColumnMenu
          rowSelection={false}
          isCellEditable={isCellEditable}
          processRowUpdate={handleRowSave}
          localeText={{
            noRowsLabel: 'No line items yet',
          }}
          sx={{
            '& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator--sideRight':
              {
                display: 'none',
              },
          }}
        />
      </Card>
    </Stack>
  );
};

const getChanges = (original: BudgetLineItem, updated: BudgetLineItem) => {
  const changes: Record<string, unknown> = {};
  if (original.description.value !== updated.description.value) {
    changes.description = updated.description.value ?? null;
  }
  if (original.account.value !== updated.account.value) {
    changes.account = updated.account.value ?? '';
  }
  if (original.costType.value !== updated.costType.value) {
    changes.costType = updated.costType.value ?? undefined;
  }
  if (original.budgetCategory.value !== updated.budgetCategory.value) {
    changes.budgetCategory = updated.budgetCategory.value ?? undefined;
  }
  if (original.activity.value !== updated.activity.value) {
    changes.activity = updated.activity.value ?? null;
  }
  const originalAmounts = JSON.stringify(
    original.fiscalYearAmounts.value ?? {}
  );
  const updatedAmounts = JSON.stringify(updated.fiscalYearAmounts.value ?? {});
  if (originalAmounts !== updatedAmounts) {
    changes.fiscalYearAmounts = updated.fiscalYearAmounts.value ?? {};
  }
  return Object.keys(changes).length > 0 ? changes : null;
};
