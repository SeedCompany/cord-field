import { useMutation } from '@apollo/client';
import { Card, Tooltip } from '@mui/material';
import {
  DataGridPro as DataGrid,
  GridCellProps,
  GridColDef,
  GridValidRowModel,
  GridValueGetter,
  GridValueSetter,
} from '@mui/x-data-grid-pro';
import { sortBy } from '@seedcompany/common';
import { sumBy } from 'lodash';
import { ComponentType, useMemo } from 'react';
import { onUpdateChangeFragment, readFragment } from '~/api';
import { IdFragment, SecuredProp } from '~/common';
import { RecalculateChangesetDiffFragmentDoc as RecalculateChangesetDiff } from '~/common/fragments';
import { useFeatureEnabled } from '~/components/Feature';
import { useCurrencyFormatter } from '~/components/Formatters/useCurrencyFormatter';
import {
  changesetGridSlots,
  useDeletedItemsOfChangeset,
} from '../../../components/Changeset';
import { compareNullable } from '../../../components/form/util';
import { isCellEditable, useCurrencyColumn } from '../../../components/Grid';
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

const getSecuredValue: GridValueGetter<
  any,
  any,
  any,
  SecuredProp<any> | null
> = (value) => value?.value;

const setSecuredValue =
  <R extends GridValidRowModel>(
    field: string
  ): GridValueSetter<R, SecuredProp<any> | null> =>
  (value, row) => ({
    ...row,
    [field]: {
      ...row[field],
      value,
    },
  });

export const ProjectBudgetRecords = (props: ProjectBudgetRecordsProps) => {
  const { loading, budget } = props;
  const isPreApprovalEnabled = useFeatureEnabled('budgetPreApproval');
  const isInitialAmountEnabled = useFeatureEnabled('budgetInitialAmount');

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

  const formatCurrency = useCurrencyFormatter({
    maximumFractionDigits: 2,
  });

  const deletedRecords = useDeletedItemsOfChangeset(isBudgetRecord);
  const rows = useMemo(() => {
    const raw: readonly BudgetRecord[] = [
      ...(budget?.value?.records ?? []),
      ...deletedRecords,
    ];
    return sortBy(raw, [
      (record) => record.fiscalYear.value,
      (record) => record.organization.value?.name.value ?? '',
    ]);
  }, [budget, deletedRecords]);

  const columns: Array<GridColDef<BudgetRecord>> = [
    {
      headerName: 'Funding Partner',
      field: 'fundingPartner',
      flex: 1,
      valueGetter: (_, row) => row.organization.value?.name.value ?? '',
    },
    {
      headerName: 'Fiscal Year',
      field: 'fiscalYear',
      flex: 1,
      valueGetter: getSecuredValue,
    },
    {
      headerName: 'Pre-Approved',
      field: 'preApprovedAmount',
      flex: 1,
      ...useCurrencyColumn(),
      valueGetter: (_, row) =>
        typeof row.preApprovedAmount.value === 'number'
          ? row.preApprovedAmount.value
          : null,
      valueFormatter: (value: number | null) =>
        value !== null ? formatCurrency(value) : '-',
      valueSetter: setSecuredValue('preApprovedAmount'),
      editable: true,
      isEditable: ({ row }) => row.preApprovedAmount.canEdit,
      changesetAware: true,
      hidden: !isPreApprovalEnabled,
    },
    {
      headerName: 'Approved',
      field: 'initialAmount',
      flex: 1,
      ...useCurrencyColumn(),
      valueGetter: getSecuredValue,
      valueSetter: setSecuredValue('initialAmount'),
      editable: true,
      isEditable: ({ row }) => row.initialAmount.canEdit,
      changesetAware: true,
      cellClassName: (params) => {
        const initial = params.row.initialAmount.value;
        const preApprovedAmount = params.row.preApprovedAmount.value;
        const exceedsApproved =
          initial != null &&
          preApprovedAmount != null &&
          initial > preApprovedAmount;

        return exceedsApproved ? 'cell-invalid' : '';
      },
      hidden: !isInitialAmountEnabled || budget?.value?.status === 'Pending',
    },
    {
      headerName: 'Amount',
      field: 'amount',
      flex: 1,
      ...useCurrencyColumn(),
      valueGetter: getSecuredValue,
      valueSetter: setSecuredValue('amount'),
      editable: true,
      isEditable: ({ row }) => row.amount.canEdit,
      changesetAware: true,
      cellClassName: (params) => {
        const amount = params.row.amount.value;
        const preApprovedAmount = params.row.preApprovedAmount.value;
        const exceedsApproved =
          amount != null &&
          preApprovedAmount != null &&
          amount > preApprovedAmount;

        return exceedsApproved ? 'cell-invalid' : '';
      },
      renderCell: (params) => {
        const amount = params.row.amount.value;
        const preApprovedAmount = params.row.preApprovedAmount.value;
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

        return params.formattedValue;
      },
    },
  ];

  const visibleColumns = columns.filter((column) => !column.hidden);

  const handleRowSave = async (record: BudgetRecord, prev: BudgetRecord) => {
    const changes = getChanges(prev, record);
    if (!changes) {
      return record;
    }

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

    return record;
  };

  return (
    <Card>
      <DataGrid
        rows={rows}
        columns={visibleColumns}
        loading={loading}
        slots={{
          ...changesetGridSlots,
          cell: withEditTooltip(changesetGridSlots.cell),
        }}
        initialState={{
          sorting: { sortModel: [{ field: 'fiscalYear', sort: 'asc' }] },
        }}
        localeText={{
          noRowsLabel:
            'Project does not have a date range or funding partnerships',
        }}
        autoHeight
        disableColumnMenu
        hideFooter
        rowSelection={false}
        sx={{
          '& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator--sideRight':
            {
              display: 'none',
            },
        }}
        isCellEditable={isCellEditable}
        processRowUpdate={handleRowSave}
      />
    </Card>
  );
};

const withEditTooltip = (BaseCell: ComponentType<GridCellProps>) => {
  const Cell = (props: GridCellProps) => {
    const cell = <BaseCell {...props} />;
    return props.isEditable && props.cellMode !== 'edit' ? (
      <Tooltip title="Double click to edit" placement="right">
        <div>{cell}</div>
      </Tooltip>
    ) : (
      cell
    );
  };
  Cell.displayName = `withEditTooltip(${
    BaseCell.displayName ?? BaseCell.name
  })`;
  return Cell;
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
const isDiff = (a: SecuredProp<number>, b: SecuredProp<number>) =>
  !isNumberEqual(a.value, b.value);
const isNumberEqual = compareNullable((a: number, b) => a === b);
