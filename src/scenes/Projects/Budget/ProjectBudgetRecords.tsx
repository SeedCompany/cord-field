import { Card } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { sortBy } from 'lodash';
import { useMemo } from 'react';
import { IdFragment, SecuredProp } from '~/common';
import {
  changesetGridComponents,
  useDeletedItemsOfChangeset,
} from '../../../components/Changeset';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import {
  BudgetRecordFragment as BudgetRecord,
  ProjectBudgetQuery,
} from './ProjectBudget.graphql';

interface ProjectBudgetRecordsProps {
  budget: ProjectBudgetQuery['project']['budget'] | undefined;
  loading: boolean;
}

const getSecuredValue = ({ value }: GridValueGetterParams<SecuredProp<any>>) =>
  value?.value;

export const ProjectBudgetRecords = (props: ProjectBudgetRecordsProps) => {
  const { loading, budget } = props;
  const formatCurrency = useCurrencyFormatter();

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
      valueGetter: ({ row }) => row.organization.value?.name.value ?? '',
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
      align: 'right',
      headerAlign: 'right',
      valueGetter: getSecuredValue,
      valueFormatter: ({ value }) => formatCurrency(value ?? 0),
      changesetAware: true,
    },
  ];

  return (
    <Card>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        components={{
          Footer: () => null,
          ...changesetGridComponents,
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
        isRowSelectable={() => false}
        sx={{
          '& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator--sideRight':
            {
              display: 'none',
            },
        }}
      />
    </Card>
  );
};

const isBudgetRecord = (obj: IdFragment): obj is BudgetRecord =>
  obj.__typename === 'BudgetRecord';
