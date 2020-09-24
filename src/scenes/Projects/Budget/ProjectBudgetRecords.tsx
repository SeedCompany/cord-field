import { Column, Components } from 'material-table';
import React, { FC, useMemo } from 'react';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { Table } from '../../../components/Table';
import {
  BudgetRecordFragment as BudgetRecord,
  ProjectBudgetQuery,
  useUpdateProjectBudgetRecordMutation,
} from './ProjectBudget.generated';

const tableComponents: Components = {
  // No toolbar since it's just empty space, we don't use it for anything.
  Toolbar: () => null,
};

interface BudgetRowData {
  id: string;
  fundingPartner: string;
  fiscalYear: string;
  amount: string | null;
  canEdit: boolean;
}

interface ProjectBudgetRecordsProps {
  budget: ProjectBudgetQuery['project']['budget'] | undefined;
  loading: boolean;
}

export const ProjectBudgetRecords: FC<ProjectBudgetRecordsProps> = (props) => {
  const { loading, budget } = props;
  const formatCurrency = useCurrencyFormatter();
  const [updateBudgetRecord] = useUpdateProjectBudgetRecordMutation();

  const records: readonly BudgetRecord[] = budget?.value?.records ?? [];

  const rowData = records
    .map<BudgetRowData>((record) => ({
      id: record.id,
      fundingPartner: record.organization.value?.name.value ?? '',
      fiscalYear: String(record.fiscalYear.value),
      amount: String(record.amount.value ?? ''),
      canEdit: record.amount.canEdit,
    }))
    .sort((a, b) => (a.fundingPartner > b.fundingPartner ? 1 : -1))
    .sort((a, b) => Number(a.fiscalYear) - Number(b.fiscalYear));

  const blankAmount = 'click to edit';
  const columns: Array<Column<BudgetRowData>> = useMemo(
    () => [
      {
        field: 'id',
        hidden: true,
      },
      {
        field: 'fundingPartner',
        editable: 'never',
      },
      {
        field: 'fiscalYear',
        editable: 'never',
      },
      {
        field: 'amount',
        type: 'currency',
        editable: (_, rowData) => rowData.canEdit,
        render: (rowData) =>
          rowData.amount ? formatCurrency(Number(rowData.amount)) : blankAmount,
      },
      {
        field: 'canEdit',
        hidden: true,
      },
    ],
    [formatCurrency]
  );

  return (
    <Table
      data={rowData}
      columns={columns}
      isLoading={loading}
      components={tableComponents}
      cellEditable={
        budget?.canEdit
          ? {
              onCellEditApproved: async (newAmount, _, data) => {
                if (newAmount === blankAmount || newAmount === '') return;
                const input = {
                  budgetRecord: {
                    id: data.id,
                    amount: Number(newAmount),
                  },
                };
                await updateBudgetRecord({ variables: { input } });
              },
            }
          : undefined
      }
      options={{
        thirdSortClick: false,
      }}
    />
  );
};
