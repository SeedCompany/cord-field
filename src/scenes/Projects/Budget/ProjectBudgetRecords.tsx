import { useMutation } from '@apollo/client';
import { sortBy, sumBy } from 'lodash';
import { Column, Components } from 'material-table';
import React, { FC, useMemo } from 'react';
import { onUpdateChangeFragment } from '../../../api';
import {
  PropertyDiff,
  useDetermineChangesetDiffItem,
} from '../../../components/Changeset';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { ChangesetAwareTable } from '../../../components/Table';
import type { ChangesetRowData } from '../../../components/Table/ChangesetAwareTable';
import {
  BudgetRecordFragment as BudgetRecord,
  CalculateNewTotalFragmentDoc as CalculateNewTotal,
  ProjectBudgetQuery,
  UpdateProjectBudgetRecordDocument,
} from './ProjectBudget.generated';

const tableComponents: Components = {
  // No toolbar since it's just empty space, we don't use it for anything.
  Toolbar: () => null,
};

interface BudgetRowData extends ChangesetRowData {
  record: BudgetRecord;
  fundingPartner: string;
  fiscalYear: string;
  amount: string | null;
}

interface ProjectBudgetRecordsProps {
  budget: ProjectBudgetQuery['project']['budget'] | undefined;
  loading: boolean;
}

export const ProjectBudgetRecords: FC<ProjectBudgetRecordsProps> = (props) => {
  const { loading, budget } = props;
  const formatCurrency = useCurrencyFormatter();
  const [updateBudgetRecord] = useMutation(UpdateProjectBudgetRecordDocument, {
    update: onUpdateChangeFragment({
      object: budget?.value ?? undefined,
      fragment: CalculateNewTotal,
      fragmentName: 'CalculateNewTotal',
      updater: (cached) => ({
        ...cached,
        total: sumBy(cached.records, (record) => record.amount.value ?? 0),
      }),
    }),
  });
  const determineChangesetDiff = useDetermineChangesetDiffItem();

  const records: readonly BudgetRecord[] = budget?.value?.records ?? [];

  const rowData = sortBy(
    records.map<BudgetRowData>((record) => {
      const diff = determineChangesetDiff(record);
      return {
        record,
        fundingPartner: record.organization.value?.name.value ?? '',
        fiscalYear: String(record.fiscalYear.value),
        amount: String(record.amount.value ?? ''),
        diffMode: diff.mode,
        diffInfo:
          diff.mode === 'changed' ? (
            <PropertyDiff
              previous={diff.previous.amount.value ?? 0}
              current={diff.current.amount.value ?? 0}
              labelBy={formatCurrency}
            />
          ) : undefined,
      };
    }),
    [(record) => record.fiscalYear, (record) => record.fundingPartner]
  );

  const blankAmount = 'click to edit';
  const columns: Array<Column<BudgetRowData>> = useMemo(
    () => [
      {
        field: 'record',
        hidden: true,
      },
      {
        field: 'fundingPartner',
        editable: 'never',
      },
      {
        field: 'fiscalYear',
        editable: 'never',
        defaultSort: 'asc',
      },
      {
        field: 'amount',
        type: 'currency',
        editable: (_, rowData) => rowData.record.amount.canEdit,
        render: (rowData) =>
          rowData.amount ? formatCurrency(Number(rowData.amount)) : blankAmount,
      },
    ],
    [formatCurrency]
  );

  return (
    <ChangesetAwareTable
      data={rowData}
      columns={columns}
      isLoading={loading}
      components={tableComponents}
      cellEditable={
        budget?.canEdit
          ? {
              onCellEditApproved: async (newAmount, _, { record }) => {
                if (newAmount === blankAmount || newAmount === '') return;
                await updateBudgetRecord({
                  variables: {
                    input: {
                      budgetRecord: {
                        id: record.id,
                        amount: Number(newAmount),
                      },
                      changeset: budget.value?.changeset?.id,
                    },
                  },
                  optimisticResponse: {
                    updateBudgetRecord: {
                      __typename: 'UpdateBudgetRecordOutput',
                      budgetRecord: {
                        __typename: 'BudgetRecord',
                        id: record.id,
                        // @ts-expect-error ignore changeset is missing new diff info
                        changeset: record.changeset,
                        amount: {
                          __typename: 'SecuredFloatNullable',
                          value: Number(newAmount),
                        },
                      },
                    },
                  },
                });
              },
            }
          : undefined
      }
      options={{
        thirdSortClick: false,
        headerStyle: {
          background: 'unset',
        },
      }}
    />
  );
};
