import { useMutation } from '@apollo/client';
import {
  Add,
  Calculate as CalculateIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  Button,
  Card,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGridPro as DataGrid, GridColDef } from '@mui/x-data-grid-pro';
import { sortBy } from '@seedcompany/common';
import { useCallback, useMemo } from 'react';
import { invalidateProps, onUpdateInvalidateProps } from '~/api';
import { useDialog } from '../../../components/Dialog';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import {
  EditNumberCell,
  enumColumn,
  isCellEditable,
  organizationColumn,
  OrganizationOption,
  textColumn,
  useDataGridSlots,
} from '../../../components/Grid';
import {
  Budget,
  FiscalYearAmounts,
  getAmounts,
  getSecuredValue,
  isHeaderLine,
  KEYSTONE_ACCOUNTS,
  sumAmounts,
  useFiscalYearColumns,
} from './budgetLineHelpers';
import {
  BudgetLineItemFragment as BudgetLineItem,
  CreateBudgetLineItemDocument,
  DeleteBudgetLineItemDocument,
  UpdateBudgetLineItemDocument,
} from './BudgetLineItem.graphql';
import { BudgetLineItemCalculatorDialog } from './BudgetLineItemCalculatorDialog';

interface ProjectBudgetLineItemsProps {
  budget: Budget | undefined;
  loading: boolean;
  /** This project's partnership organizations, for the Service Provider /
   * Funder column pickers -- scoped to the project, not a global org search. */
  partnerOrganizations: readonly OrganizationOption[];
}

// budget-line-items-poc: known values ported from the calc engine's
// regression fixture (cord-api-v3 budget-calculation.service.spec.ts /
// ADMIN_FEE_ACCOUNT) -- a placeholder chart-of-accounts list. A real
// reference-data admin UI for these is explicitly out of scope for this POC.
//
// (item 2 addition): 'Salary/Stipend - Consultant', 'HR Services', and
// 'Program Mgt Support' were added to complete the full 7-account
// `KEYSTONE_ACCOUNTS` set (see budgetLineHelpers) -- without them, 3 of the 7
// benchmark-calculator-eligible accounts could never actually be selected in
// this column, so the calculator would be unreachable for them.
const ACCOUNTS = [
  'Salary/Stipend - Translator',
  'Salary/Stipend - Non Translator',
  'Salary/Stipend - Consultant',
  'Travel Expense',
  'Meeting/Seminar Expense',
  'Printing',
  'Office Expense',
  'Financial Services',
  'HR Services',
  'IT Services',
  'Program Mgt Support',
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

export const ProjectBudgetLineItems = (props: ProjectBudgetLineItemsProps) => {
  const { budget, loading, partnerOrganizations } = props;
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

  const fiscalYearColumns = useFiscalYearColumns(budget);

  // budget-line-items-poc (item 1): rows -- both `line` and `header` --
  // are now ordered by the server-assigned `position`, not `createdAt`.
  const rows = useMemo(
    () => sortBy(budget?.lineItems ?? [], (row) => row.position.value ?? 0),
    [budget]
  );

  // budget-line-items-poc (item 2): the benchmark/keystone calculator modal,
  // one shared dialog instance opened against whichever row's calc icon was
  // clicked.
  const [calcDialogState, openCalcDialog, calcLineItem] =
    useDialog<BudgetLineItem>();

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

    // budget-line-items-poc: rightmost data column, before row actions --
    // client-side sum of this row's fiscalYearAmounts, matching the
    // prototype's `sum(ln.fy)` per row (src/app.js's `renderLines()`).
    const totalCol: GridColDef<BudgetLineItem> = {
      field: 'total',
      headerName: 'Total',
      description: "Sum of this line's amounts across all fiscal years",
      flex: 1,
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      filterable: false,
      valueGetter: (_, row) => sumAmounts(getAmounts(row.fiscalYearAmounts)),
      valueFormatter: (value: number) => formatCurrency(value),
    };

    // budget-line-items-poc (item 1): number of columns (starting from
    // `description`, inclusive) a `header` row's description cell should
    // span -- covers every data column through `totalCol`, but NOT
    // `actionsCol`, matching the prototype's `renderLines()` (`hcolspan`
    // covers everything except the trailing `rowtools` cell, so the delete
    // button still renders normally on header rows).
    const dataColumnsBeforeFy = 6; // account, costType, budgetCategory, activity, serviceProvider, funder
    const headerColSpan = 1 + dataColumnsBeforeFy + fyColumns.length + 1; // + description itself, + totalCol

    // budget-line-items-poc (item 2): calc icon is only meaningful for
    // `KEYSTONE_ACCOUNTS` (see budgetLineHelpers) -- shown (disabled, with
    // an explanatory tooltip) for any other line account, and omitted
    // entirely for `header` rows, matching the prototype's `rowtools`
    // (header rows only ever show the trash icon).
    const actionsCol: GridColDef<BudgetLineItem> = {
      field: 'actions',
      headerName: '',
      width: 88,
      align: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      renderCell: ({ row }) => {
        const isHeader = isHeaderLine(row);
        const canBenchmark =
          !isHeader &&
          (KEYSTONE_ACCOUNTS as readonly string[]).includes(
            getSecuredValue(row.account) ?? ''
          );
        return (
          <Stack direction="row" spacing={0}>
            {!isHeader ? (
              <Tooltip
                title={
                  canBenchmark
                    ? 'Benchmark calculator'
                    : 'Benchmark calculator (only available for keystone salary/service accounts)'
                }
              >
                <span>
                  <IconButton
                    size="small"
                    disabled={!canBenchmark}
                    onClick={() => openCalcDialog(row)}
                  >
                    <CalculateIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            ) : null}
            <Tooltip title={isHeader ? 'Delete Section' : 'Delete Line Item'}>
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
          </Stack>
        );
      },
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
        // budget-line-items-poc (item 1): `header` rows render as a
        // full-width section-divider label instead of a normal data cell,
        // and their description cell spans across every other data column.
        colSpan: (_value, row) =>
          isHeaderLine(row) ? headerColSpan : undefined,
        renderCell: (params) =>
          isHeaderLine(params.row) ? (
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, width: '100%' }}
            >
              {params.value || 'Untitled section'}
            </Typography>
          ) : (
            params.value ?? ''
          ),
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
      {
        field: 'serviceProvider',
        headerName: 'Service Provider',
        flex: 1,
        minWidth: 180,
        ...organizationColumn<BudgetLineItem>(partnerOrganizations),
        valueGetter: (_, row) => row.serviceProvider.value?.id ?? null,
        valueSetter: (value: string | null, row) => ({
          ...row,
          serviceProvider: {
            ...row.serviceProvider,
            value: buildOrganizationValue(value, partnerOrganizations),
          },
        }),
        editable: true,
        isEditable: ({ row }) => row.serviceProvider.canEdit,
      },
      {
        field: 'funder',
        headerName: 'Funder',
        flex: 1,
        minWidth: 180,
        ...organizationColumn<BudgetLineItem>(partnerOrganizations),
        valueGetter: (_, row) => row.funder.value?.id ?? null,
        valueSetter: (value: string | null, row) => ({
          ...row,
          funder: {
            ...row.funder,
            value: buildOrganizationValue(value, partnerOrganizations),
          },
        }),
        editable: true,
        isEditable: ({ row }) => row.funder.canEdit,
      },
      ...fyColumns,
      totalCol,
      actionsCol,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fiscalYearColumns,
    formatCurrency,
    deleteLineItem,
    budget,
    partnerOrganizations,
    openCalcDialog,
  ]);

  const handleAddLine = useCallback(() => {
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
  }, [budget, createLineItem]);

  // budget-line-items-poc (item 1): creates a `header`-type row (a visual
  // section divider) -- `account` is omitted entirely (rather than sent as
  // `''` like a normal line), matching the backend's "omit for header rows"
  // guidance on `CreateBudgetLineItem.account`.
  const handleAddSection = useCallback(() => {
    if (!budget) {
      return;
    }
    void createLineItem({
      variables: {
        input: {
          budget: budget.id,
          type: 'header',
        },
      },
    });
  }, [budget, createLineItem]);

  // budget-line-items-poc (item 1): a custom two-button footer (line item +
  // section), replacing the shared single-button `createAddItemFooter` --
  // styled the same way (same background/border/padding), just with two
  // labeled buttons instead of one bare "+" icon so the two actions are
  // distinguishable.
  const LineItemsFooter = useMemo(() => {
    const Footer = () => (
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          background: 'var(--DataGrid-containerBackground)',
          p: 1,
          borderTop: 'thin solid var(--DataGrid-rowBorderColor)',
          borderBottomLeftRadius: 'inherit',
          borderBottomRightRadius: 'inherit',
        }}
      >
        <Tooltip title="Add a new budget line item">
          <Button
            onClick={handleAddLine}
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<Add />}
          >
            Add Line Item
          </Button>
        </Tooltip>
        <Tooltip title="Add a new section heading">
          <Button
            onClick={handleAddSection}
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<Add />}
          >
            Section
          </Button>
        </Tooltip>
      </Stack>
    );
    Footer.displayName = 'LineItemsFooter';
    return Footer;
  }, [handleAddLine, handleAddSection]);

  const { slots, slotProps } = useDataGridSlots(
    {},
    { slots: { footer: LineItemsFooter } }
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
          getRowClassName={({ row }) =>
            isHeaderLine(row) ? 'budget-line-header-row' : ''
          }
          localeText={{
            noRowsLabel: 'No line items yet',
          }}
          sx={{
            '& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator--sideRight':
              {
                display: 'none',
              },
            // budget-line-items-poc (item 1): a distinct background for
            // `header` (section-divider) rows, matching the prototype's
            // `.hdr-row` styling intent.
            '& .budget-line-header-row': {
              backgroundColor: 'action.hover',
            },
          }}
        />
      </Card>
      {budget ? (
        <BudgetLineItemCalculatorDialog
          {...calcDialogState}
          budget={budget}
          lineItem={calcLineItem}
        />
      ) : null}
    </Stack>
  );
};

// budget-line-items-poc: builds the local/optimistic `Organization`-shaped
// value the grid renders between an edit and the mutation response landing
// in the Apollo cache (which is what actually drives the row after that, via
// normalized-entity merge on `id`). Shared by the Service Provider and
// Funder columns.
const buildOrganizationValue = (
  id: string | null,
  options: readonly OrganizationOption[]
): BudgetLineItem['serviceProvider']['value'] => {
  if (!id) return null;
  const org = options.find((o) => o.id === id);
  // `createdAt`'s branded `ISOString` type isn't structurally satisfiable by
  // a plain string literal (see the `fiscalYearAmounts` valueSetter above for
  // the same JSONObject-brand situation) -- this whole object is a
  // synthetic, local-only value never sent to the server, so the cast is
  // unavoidable rather than a real type hazard.
  return {
    __typename: 'Organization',
    id,
    createdAt: new Date().toISOString(),
    name: {
      __typename: 'SecuredString',
      canRead: true,
      canEdit: true,
      value: org?.name ?? '',
    },
  } as unknown as BudgetLineItem['serviceProvider']['value'];
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
  if (
    original.serviceProvider.value?.id !== updated.serviceProvider.value?.id
  ) {
    changes.serviceProvider = updated.serviceProvider.value?.id ?? null;
  }
  if (original.funder.value?.id !== updated.funder.value?.id) {
    changes.funder = updated.funder.value?.id ?? null;
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
