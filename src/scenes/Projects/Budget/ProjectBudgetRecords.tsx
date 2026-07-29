import { useMutation } from '@apollo/client';
import { Card, Tooltip } from '@mui/material';
import {
  DataGridPro as DataGrid,
  GridCell,
  GridColDef,
  GridColumnGroupingModel,
} from '@mui/x-data-grid-pro';
import { sumBy } from 'lodash';
import { useMemo } from 'react';
import { onUpdateChangeFragment, readFragment } from '~/api';
import { IdFragment } from '~/common';
import { RecalculateChangesetDiffFragmentDoc as RecalculateChangesetDiff } from '~/common/fragments';
import { useFeatureEnabled } from '~/components/Feature';
import { useCurrencyFormatter } from '~/components/Formatters/useCurrencyFormatter';
import { useDeletedItemsOfChangeset } from '../../../components/Changeset';
import { compareNullable } from '../../../components/form/util';
import {
  isCellEditable,
  useCurrencyColumn,
  withEditTooltip,
} from '../../../components/Grid';
import {
  isRecordDrivenByLineItems,
  useFiscalYearColumns,
} from './budgetLineHelpers';
import {
  BudgetRecordFragment as BudgetRecord,
  CalculateNewTotalAndRollupFragmentDoc as CalculateNewTotalAndRollup,
  ProjectBudgetQuery,
  UpdateProjectBudgetRecordDocument as UpdateRecord,
} from './ProjectBudget.graphql';

interface ProjectBudgetRecordsProps {
  budget: ProjectBudgetQuery['project']['budget'] | undefined;
  loading: boolean;
}

/**
 * budget-line-items-poc: the "Funding Budget" grid, restructured from one
 * row per (organization, fiscal year) `BudgetRecord` into one row per
 * funding-partner organization, with one column per fiscal year -- matching
 * `BudgetBreakdown`'s wide layout convention (see that file + this one's
 * sibling grids for the established one-column-per-`useFiscalYearColumns`
 * pattern), but fully editable per cell, which `BudgetBreakdown` never had
 * to solve.
 *
 * A single grid ROW now spans up to N underlying `BudgetRecord` entities
 * (one per fiscal year) instead of being one itself, so `recordsByYear`
 * holds each fiscal year's record (keyed by year, `undefined` when this
 * organization has no record for that particular year -- nothing to
 * show/edit there). Every fiscal-year column's `valueGetter`/`valueSetter`
 * reads/writes through `recordsByYear[year]` rather than the row directly.
 *
 * Known, disclosed trade-offs from this restructuring (see final report for
 * the full writeup):
 *  - The changeset-diff visual treatment (`changesetGridSlots`'s row
 *    highlight color + `ChangesetCell`'s inline before/after badge) is not
 *    applied here anymore. Both look up a diffed entity by identifying the
 *    *whole grid row* against the changeset diff (`apollo.cache.identify`),
 *    which assumed one row == one `BudgetRecord`. That assumption no longer
 *    holds (a row is now an aggregate of up to N records), so re-enabling
 *    equivalent per-cell diffing would require a real rewrite of that
 *    machinery -- out of scope for this pass. Records that exist only
 *    because they're pending removal in the active changeset are still
 *    merged in and shown (via `deletedRecords` below, same as before), just
 *    without the red highlight/badge that used to flag them as such.
 *  - Fiscal-year columns come from `useFiscalYearColumns(budget)`, which is
 *    driven by the project's calculated date range (or a lineItems-derived
 *    fallback) -- NOT from `budget.records` itself. A `BudgetRecord` whose
 *    fiscal year falls outside that range (e.g. no MOU dates set, or a
 *    stray record for a year the project no longer spans) has no column to
 *    render in and won't appear. This mirrors the exact convention already
 *    used by `BudgetBreakdown`/`BudgetPartnerLedger`/
 *    `OtherPartnerContributionsGrid`, so it's intentional, but it's a real
 *    behavior change from today's flat grid, which showed every record
 *    unconditionally.
 */
interface OrgBudgetRow {
  readonly id: string;
  readonly name: string;
  readonly recordsByYear: Partial<Record<number, BudgetRecord>>;
  readonly isGrandTotal: boolean;
}

const GRAND_TOTAL_ROW_ID = '__grand_total__';

type MetricField = 'preApprovedAmount' | 'initialAmount' | 'amount';

const METRIC_LABELS: Record<MetricField, string> = {
  preApprovedAmount: 'Pre-Approved',
  initialAmount: 'Initially Approved',
  amount: 'Amount',
};

export const ProjectBudgetRecords = (props: ProjectBudgetRecordsProps) => {
  const { loading, budget } = props;
  const isPreApprovalEnabled = useFeatureEnabled('budgetPreApproval');
  const isInitialAmountEnabled = useFeatureEnabled('budgetInitialAmount');
  // budget-line-items-poc: same conditions as today's per-column `hidden`,
  // just inverted to a "should this metric's fiscal-year column group even
  // be built" flag, since column-grouping needs the whole group omitted
  // (not just hidden) when its metric isn't in play.
  const showPreApproved =
    isPreApprovalEnabled && budget?.value?.project.type === 'Internship';
  const showInitialAmount =
    isInitialAmountEnabled && budget?.value?.status !== 'Pending';

  const [updateBudgetRecord, { client: apollo }] = useMutation(UpdateRecord, {
    update: onUpdateChangeFragment({
      object: budget?.value ?? undefined,
      fragment: CalculateNewTotalAndRollup,
      updater: (cached) => ({
        ...cached,
        total: sumBy(cached.records, (record) => record.amount.value ?? 0),
        summary: {
          hasPreApproved: cached.records.some(
            (record) => record.preApprovedAmount.value != null
          ),
          preApprovedExceeded: cached.records.some((record) => {
            const amount = record.amount.value;
            const preApproved = record.preApprovedAmount.value;
            return (
              amount != null && preApproved != null && amount > preApproved
            );
          }),
        },
      }),
    }),
  });

  const formatCurrency = useCurrencyFormatter({ maximumFractionDigits: 2 });
  const currencyColumnProps = useCurrencyColumn();
  const fiscalYearColumns = useFiscalYearColumns(budget?.value ?? undefined);

  const deletedRecords = useDeletedItemsOfChangeset(isBudgetRecord);

  // budget-line-items-poc: same base record set as before (current view +
  // any changeset-removed records, so an organization about to lose its
  // last record still shows up as a row) -- just fanned out into a
  // per-(org, year) lookup instead of one row per entry.
  const allRecords: readonly BudgetRecord[] = useMemo(
    () => [...(budget?.value?.records ?? []), ...deletedRecords],
    [budget, deletedRecords]
  );

  const recordsByOrgAndYear = useMemo(() => {
    const map = new Map<string, BudgetRecord>();
    for (const record of allRecords) {
      const orgId = record.organization.value?.id;
      const year = record.fiscalYear.value;
      if (!orgId || year == null) {
        continue;
      }
      const key = `${orgId}::${year}`;
      // `budget.value.records` is listed first in `allRecords`, so it wins
      // over `deletedRecords` on the (should-be-impossible) chance both
      // contain an entry for the same (org, year).
      if (!map.has(key)) {
        map.set(key, record);
      }
    }
    return map;
  }, [allRecords]);

  // budget-line-items-poc: distinct funding-partner organizations, sorted by
  // name -- matches `BudgetBreakdown`'s `sortedKeys` sorting convention
  // (`localeCompare` on the display label).
  const organizations = useMemo(() => {
    const byId = new Map<string, string>();
    for (const record of allRecords) {
      const org = record.organization.value;
      if (org) {
        byId.set(org.id, org.name.value ?? org.id);
      }
    }
    return Array.from(byId, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [allRecords]);

  const rows: OrgBudgetRow[] = useMemo(
    () =>
      organizations.map((org) => {
        const recordsByYear: Partial<Record<number, BudgetRecord>> = {};
        for (const fy of fiscalYearColumns) {
          const record = recordsByOrgAndYear.get(`${org.id}::${fy.year}`);
          if (record) {
            recordsByYear[fy.year] = record;
          }
        }
        return {
          id: org.id,
          name: org.name,
          isGrandTotal: false,
          recordsByYear,
        };
      }),
    [organizations, recordsByOrgAndYear, fiscalYearColumns]
  );

  // budget-line-items-poc: per-fiscal-year sums across every organization,
  // for the pinned grand-total row below -- computed once here rather than
  // per-column, so the 3 metrics only get summed once per fiscal year.
  const totalsByYear = useMemo(() => {
    const map = new Map<
      number,
      { amount: number; preApprovedAmount: number; initialAmount: number }
    >();
    for (const fy of fiscalYearColumns) {
      let amount = 0;
      let preApprovedAmount = 0;
      let initialAmount = 0;
      for (const org of organizations) {
        const record = recordsByOrgAndYear.get(`${org.id}::${fy.year}`);
        if (record) {
          amount += record.amount.value ?? 0;
          preApprovedAmount += record.preApprovedAmount.value ?? 0;
          initialAmount += record.initialAmount.value ?? 0;
        }
      }
      map.set(fy.year, { amount, preApprovedAmount, initialAmount });
    }
    return map;
  }, [fiscalYearColumns, organizations, recordsByOrgAndYear]);

  const grandTotalAmount = useMemo(
    () => sumBy(Array.from(totalsByYear.values()), (t) => t.amount),
    [totalsByYear]
  );

  // budget-line-items-poc: the bold grand-total row, kept pinned to the
  // bottom (via `pinnedRows` below) rather than appended to `rows` --
  // that way it can't be reordered away from the bottom by a user sorting
  // one of the fiscal-year columns, and it's never mistaken for an
  // organization row (e.g. by a test counting "one row per organization").
  const grandTotalRow: OrgBudgetRow = useMemo(
    () => ({
      id: GRAND_TOTAL_ROW_ID,
      name: 'Total',
      isGrandTotal: true,
      recordsByYear: {},
    }),
    []
  );

  const columns: Array<GridColDef<OrgBudgetRow>> = useMemo(() => {
    const buildMetricFyColumns = (
      field: MetricField
    ): Array<GridColDef<OrgBudgetRow>> =>
      fiscalYearColumns.map((fy): GridColDef<OrgBudgetRow> => {
        const col: GridColDef<OrgBudgetRow> = {
          field: `${field}_${fy.year}`,
          headerName: fy.label,
          description: `${fy.label} ${METRIC_LABELS[field]}`,
          flex: 1,
          minWidth: 120,
          ...currencyColumnProps,
          valueGetter: (_, row) => {
            if (row.isGrandTotal) {
              return totalsByYear.get(fy.year)?.[field] ?? null;
            }
            return row.recordsByYear[fy.year]?.[field].value ?? null;
          },
          valueSetter: (value, row) => {
            const record = row.recordsByYear[fy.year];
            if (row.isGrandTotal || !record) {
              return row;
            }
            return {
              ...row,
              recordsByYear: {
                ...row.recordsByYear,
                [fy.year]: {
                  ...record,
                  [field]: { ...record[field], value },
                },
              },
            };
          },
          editable: true,
          isEditable: ({ row }) => {
            if (row.isGrandTotal) {
              return false;
            }
            const record = row.recordsByYear[fy.year];
            if (!record?.[field].canEdit) {
              return false;
            }
            // budget-line-items-poc: only `amount` gets the "locked because
            // a Field Budget line item drives it" treatment -- matches
            // today's behavior, where Pre-Approved/Initially Approved never
            // had this lock.
            return (
              field !== 'amount' ||
              !isRecordDrivenByLineItems(
                budget?.value?.lineItems,
                row.id,
                fy.year
              )
            );
          },
        };

        if (field === 'preApprovedAmount') {
          col.valueFormatter = (value: number | null) =>
            value !== null ? formatCurrency(value) : '-';
        }

        if (field === 'initialAmount') {
          col.cellClassName = (params) => {
            const record = params.row.isGrandTotal
              ? undefined
              : params.row.recordsByYear[fy.year];
            if (!record) {
              return '';
            }
            const initial = record.initialAmount.value;
            const preApprovedAmount = record.preApprovedAmount.value;
            const exceedsApproved =
              initial != null &&
              preApprovedAmount != null &&
              initial > preApprovedAmount;
            return exceedsApproved ? 'cell-invalid' : '';
          };
        }

        if (field === 'amount') {
          col.cellClassName = (params) => {
            const record = params.row.isGrandTotal
              ? undefined
              : params.row.recordsByYear[fy.year];
            if (!record) {
              return '';
            }
            const amount = record.amount.value;
            const preApprovedAmount = record.preApprovedAmount.value;
            const exceedsApproved =
              amount != null &&
              preApprovedAmount != null &&
              amount > preApprovedAmount;
            const driven = isRecordDrivenByLineItems(
              budget?.value?.lineItems,
              params.row.id,
              fy.year
            );
            return [exceedsApproved && 'cell-invalid', driven && 'cell-locked']
              .filter(Boolean)
              .join(' ');
          };
          col.renderCell = (params) => {
            const record = params.row.isGrandTotal
              ? undefined
              : params.row.recordsByYear[fy.year];
            if (!record) {
              return params.formattedValue;
            }
            const amount = record.amount.value;
            const preApprovedAmount = record.preApprovedAmount.value;
            const exceedsApproved =
              amount != null &&
              preApprovedAmount != null &&
              amount > preApprovedAmount;

            if (exceedsApproved) {
              return (
                <Tooltip
                  title={`Amount ${formatCurrency(
                    amount
                  )} exceeds pre-approved amount ${formatCurrency(
                    preApprovedAmount
                  )}`}
                  placement="top"
                >
                  <span>{params.formattedValue}</span>
                </Tooltip>
              );
            }

            const driven = isRecordDrivenByLineItems(
              budget?.value?.lineItems,
              params.row.id,
              fy.year
            );
            if (driven) {
              return (
                <Tooltip
                  title="Driven by this project's Field Budget line items with this funder — edit the Funder column on a line item to change this"
                  placement="top"
                >
                  <span>{params.formattedValue}</span>
                </Tooltip>
              );
            }

            return params.formattedValue;
          };
        }

        return col;
      });

    const fundingPartnerCol: GridColDef<OrgBudgetRow> = {
      headerName: 'Funding Partner',
      field: 'fundingPartner',
      flex: 1.2,
      minWidth: 200,
      valueGetter: (_, row) => row.name,
    };

    const totalCol: GridColDef<OrgBudgetRow> = {
      field: 'total',
      headerName: 'Total',
      description: "Sum of this partner's Amount across all fiscal years",
      flex: 1,
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      filterable: false,
      valueGetter: (_, row) =>
        row.isGrandTotal
          ? grandTotalAmount
          : sumBy(
              fiscalYearColumns,
              (fy) => row.recordsByYear[fy.year]?.amount.value ?? 0
            ),
      valueFormatter: (value: number) => formatCurrency(value),
    };

    return [
      fundingPartnerCol,
      ...(showPreApproved ? buildMetricFyColumns('preApprovedAmount') : []),
      ...(showInitialAmount ? buildMetricFyColumns('initialAmount') : []),
      ...buildMetricFyColumns('amount'),
      totalCol,
    ];
  }, [
    fiscalYearColumns,
    currencyColumnProps,
    formatCurrency,
    showPreApproved,
    showInitialAmount,
    budget,
    totalsByYear,
    grandTotalAmount,
  ]);

  // budget-line-items-poc: Pre-Approved/Initially Approved are represented
  // as column *groups* (DataGridPro's column-grouping feature) -- each
  // group's children are that metric's own per-fiscal-year columns built
  // above. A group is omitted entirely (not just hidden) when its feature
  // flag/condition says so, so there's no dangling empty group header. The
  // "Amount" group is always present since it's this grid's primary,
  // always-on metric.
  const columnGroupingModel: GridColumnGroupingModel = useMemo(() => {
    const model: GridColumnGroupingModel = [];
    if (showPreApproved) {
      model.push({
        groupId: 'preApprovedAmount',
        headerName: 'Pre-Approved',
        children: fiscalYearColumns.map((fy) => ({
          field: `preApprovedAmount_${fy.year}`,
        })),
      });
    }
    if (showInitialAmount) {
      model.push({
        groupId: 'initialAmount',
        headerName: 'Initially Approved',
        description:
          'The amount that was initially approved when the project started',
        children: fiscalYearColumns.map((fy) => ({
          field: `initialAmount_${fy.year}`,
        })),
      });
    }
    model.push({
      groupId: 'amount',
      headerName: 'Amount',
      description: 'The current/adjusted amount from changes to the plan',
      children: fiscalYearColumns.map((fy) => ({
        field: `amount_${fy.year}`,
      })),
    });
    return model;
  }, [showPreApproved, showInitialAmount, fiscalYearColumns]);

  const saveRecordChanges = async (
    record: BudgetRecord,
    changes: NonNullable<ReturnType<typeof getChanges>>
  ) => {
    // If we have a changeset, fetch (from cache) the additional
    // data required to provide an optimistic response.
    // We need this because in our update operation we ask for the
    // API to send back the updated diff. Because of this Apollo
    // wants the updated diff, so we'll tell it that optimistically
    // it is unchanged. The actual API result still overrides this
    // when we get it.
    const cachedChangeset = record.changeset
      ? readFragment(apollo.cache, {
          fragment: RecalculateChangesetDiff,
          object: record,
        })?.changeset
      : null;

    await updateBudgetRecord({
      variables: {
        input: {
          id: record.id,
          ...changes,
          changeset: record.changeset?.id,
        },
      },
      optimisticResponse:
        record.changeset && !cachedChangeset
          ? // If we are in a changeset, but we cannot get the required
            // data from cache, then skip the optimistic response.
            undefined
          : {
              updateBudgetRecord: {
                __typename: 'BudgetRecordUpdated',
                budgetRecord: {
                  __typename: 'BudgetRecord',
                  id: record.id,
                  changeset: cachedChangeset,
                  amount: {
                    __typename: 'SecuredFloatNullable',
                    value:
                      changes.amount !== undefined
                        ? changes.amount
                        : record.amount.value,
                  },
                  preApprovedAmount: {
                    __typename: 'SecuredFloatNullable',
                    value:
                      changes.preApprovedAmount !== undefined
                        ? changes.preApprovedAmount
                        : record.preApprovedAmount.value,
                  },
                  initialAmount: {
                    __typename: 'SecuredFloatNullable',
                    value:
                      changes.initialAmount !== undefined
                        ? changes.initialAmount
                        : record.initialAmount.value,
                  },
                },
              },
            },
    });
  };

  // budget-line-items-poc: a single cell edit still only touches one
  // underlying `BudgetRecord` (this row's organization × the edited
  // column's fiscal year), but since a grid row now aggregates N of them,
  // this diffs *every* fiscal year's record for this row rather than
  // assuming a single one -- so a multi-cell commit (e.g. a paste across a
  // row) also persists correctly, not just a single-cell edit.
  const handleRowSave = async (
    row: OrgBudgetRow,
    prevRow: OrgBudgetRow
  ): Promise<OrgBudgetRow> => {
    if (row.isGrandTotal) {
      return row;
    }
    await Promise.all(
      fiscalYearColumns.map(async (fy) => {
        const prevRecord = prevRow.recordsByYear[fy.year];
        const nextRecord = row.recordsByYear[fy.year];
        if (!prevRecord || !nextRecord) {
          return;
        }
        const changes = getChanges(prevRecord, nextRecord);
        if (!changes) {
          return;
        }
        await saveRecordChanges(nextRecord, changes);
      })
    );
    return row;
  };

  return (
    <Card>
      <DataGrid
        rows={rows}
        columns={columns}
        columnGroupingModel={columnGroupingModel}
        pinnedRows={{ bottom: [grandTotalRow] }}
        loading={loading}
        slots={{
          cell: withEditTooltip(GridCell),
        }}
        localeText={{
          noRowsLabel:
            'Project does not have a date range or funding partnerships',
        }}
        getRowClassName={(params) =>
          params.row.isGrandTotal ? 'grand-total-row' : ''
        }
        autoHeight
        disableColumnMenu
        hideFooter
        rowSelection={false}
        sx={{
          '& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator--sideRight':
            {
              display: 'none',
            },
          // budget-line-items-poc: matches `BudgetBreakdown`'s bottom
          // total-row styling exactly (bold + a top divider border).
          '& .grand-total-row': {
            fontWeight: 700,
            borderTop: '2px solid',
            borderTopColor: 'divider',
          },
        }}
        isCellEditable={isCellEditable}
        processRowUpdate={handleRowSave}
      />
    </Card>
  );
};

const isBudgetRecord = (obj: IdFragment): obj is BudgetRecord =>
  obj.__typename === 'BudgetRecord';

const getChanges = (original: BudgetRecord, updated: BudgetRecord) => {
  const changes = {
    ...(isDiff(original.amount, updated.amount) && {
      amount: updated.amount.value ?? null,
    }),
    ...(isDiff(original.preApprovedAmount, updated.preApprovedAmount) && {
      preApprovedAmount: updated.preApprovedAmount.value ?? null,
    }),
    ...(isDiff(original.initialAmount, updated.initialAmount) && {
      initialAmount: updated.initialAmount.value ?? null,
    }),
  };
  return Object.keys(changes).length > 0 ? changes : null;
};
const isDiff = (a: { value?: number | null }, b: { value?: number | null }) =>
  !isNumberEqual(a.value, b.value);
const isNumberEqual = compareNullable((a: number, b) => a === b);
