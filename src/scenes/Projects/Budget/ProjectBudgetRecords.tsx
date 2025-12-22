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
import { useCurrencyFormatter } from '~/components/Formatters/useCurrencyFormatter';
import {
  changesetGridSlots,
  useDeletedItemsOfChangeset,
} from '../../../components/Changeset';
import { useCurrencyColumn } from '../../../components/Grid/useCurrencyColumn';
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
  const [updateBudgetRecord, { client: apollo }] = useMutation(UpdateRecord, {
    update: onUpdateChangeFragment({
      object: budget?.value ?? undefined,
      fragment: CalculateNewTotalAndRollup,
      updater: (cached) => ({
        ...cached,
        total: sumBy(cached.records, (record) => record.amount.value ?? 0),
        recordRollup: {
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
        row.preApprovedAmount.value !== null
          ? row.preApprovedAmount.value
          : null,
      valueFormatter: (value) => (value !== null ? formatCurrency(value) : '-'),
      valueSetter: setSecuredValue('preApprovedAmount'),
      editable: true,
    },
    {
      headerName: 'Amount',
      field: 'amount',
      flex: 1,
      ...useCurrencyColumn(),
      valueGetter: getSecuredValue,
      valueSetter: setSecuredValue('amount'),
      editable: true,
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

  const handleRowSave = async (record: BudgetRecord, prev: BudgetRecord) => {
    // Check if either amount or preApprovedAmount has changed
    const amountChanged = record.amount.value != prev.amount.value;
    const preApprovedAmountChanged =
      Number(record.preApprovedAmount.value) !=
      Number(prev.preApprovedAmount.value);

    if (!amountChanged && !preApprovedAmountChanged) {
      return record;
    }

    const newAmount = record.amount.value || null;
    const newPreApprovedAmount = record.preApprovedAmount.value || null;

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
          budgetRecord: {
            id: record.id,
            ...(amountChanged && { amount: newAmount }),
            ...(preApprovedAmountChanged && {
              preApprovedAmount: newPreApprovedAmount,
            }),
          },
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
                __typename: 'UpdateBudgetRecordOutput',
                budgetRecord: {
                  __typename: 'BudgetRecord',
                  id: record.id,
                  changeset: cachedChangeset,
                  amount: {
                    __typename: 'SecuredFloatNullable',
                    value: amountChanged ? newAmount : record.amount.value,
                  },
                  preApprovedAmount: {
                    __typename: 'SecuredFloatNullable',
                    value: newPreApprovedAmount,
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
        columns={columns}
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
        isCellEditable={({ row: record }) => record.amount.canEdit}
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
