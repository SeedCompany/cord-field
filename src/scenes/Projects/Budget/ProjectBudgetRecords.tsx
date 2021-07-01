import { useApolloClient, useMutation } from '@apollo/client';
import { sortBy, sumBy } from 'lodash';
import { Column, Components } from 'material-table';
import React, { FC, useMemo } from 'react';
import {
  onUpdateChangeFragment,
  readFragment,
  RecalculateChangesetDiffFragmentDoc as RecalculateChangesetDiff,
} from '../../../api';
import {
  PropertyDiff,
  useDeletedItemsOfChangeset,
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
  const apollo = useApolloClient();
  const [updateBudgetRecord] = useMutation(UpdateProjectBudgetRecordDocument, {
    update: onUpdateChangeFragment({
      object: budget?.value ?? undefined,
      fragment: CalculateNewTotal,
      updater: (cached) => ({
        ...cached,
        total: sumBy(cached.records, (record) => record.amount.value ?? 0),
      }),
    }),
  });
  const determineChangesetDiff = useDetermineChangesetDiffItem();
  const deletedRecords = useDeletedItemsOfChangeset(
    (obj): obj is BudgetRecord => obj.__typename === 'BudgetRecord'
  );

  const records: readonly BudgetRecord[] = budget?.value?.records ?? [];

  const rowData = sortBy(
    [...records, ...deletedRecords].map<BudgetRowData>((record) => {
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
                        amount: Number(newAmount),
                      },
                      changeset: budget.value?.changeset?.id,
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
