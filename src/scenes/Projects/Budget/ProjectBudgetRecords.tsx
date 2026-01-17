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
import {
  changesetGridSlots,
  useDeletedItemsOfChangeset,
} from '../../../components/Changeset';
import { useCurrencyColumn } from '../../../components/Grid/useCurrencyColumn';
import {
  BudgetRecordFragment as BudgetRecord,
  CalculateNewTotalFragmentDoc as CalculateNewTotal,
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
      fragment: CalculateNewTotal,
      updater: (cached) => ({
        ...cached,
        total: sumBy(cached.records, (record) => record.amount.value ?? 0),
      }),
    }),
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
      headerName: 'Amount',
      field: 'amount',
      flex: 1,
      ...useCurrencyColumn(),
      valueGetter: getSecuredValue,
      valueSetter: setSecuredValue('amount'),
      changesetAware: true,
      editable: true,
    },
  ];

  const handleRowSave = async (record: BudgetRecord, prev: BudgetRecord) => {
    // eslint-disable-next-line eqeqeq
    if (record.amount.value == prev.amount.value) {
      return record;
    }
    const newAmount = record.amount.value || null;

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
          amount: newAmount,
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
                    value: newAmount,
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
