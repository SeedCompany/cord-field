import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { sumBy } from 'lodash';
import { Column, Components } from 'material-table';
import React, { useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { ContentContainer } from '../../../components/Layout';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Table } from '../../../components/Table';
import {
  BudgetRecordFragment as BudgetRecord,
  useProjectBudgetQuery,
  useUpdateProjectBudgetRecordMutation,
} from './ProjectBudget.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  header: {
    margin: spacing(3, 4, 3, 0),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    maxWidth: breakpoints.values.md,
  },
  tableWrapper: {
    maxWidth: breakpoints.values.md,
    margin: spacing(0, 4, 4, 0),
  },
  totalLoading: {
    width: '10%',
  },
  toolbar: {
    padding: spacing(2),
    paddingBottom: spacing(1),
  },
}));

const tableComponents: Components = {
  // No toolbar since it's just empty space, we don't use it for anything.
  Toolbar: () => null,
};

interface BudgetRowData {
  id: string;
  organization: string;
  fiscalYear: string;
  amount: string | null;
  canEdit: boolean;
}

export const ProjectBudget = () => {
  const { projectId } = useParams();
  const classes = useStyles();
  const formatCurrency = useCurrencyFormatter();

  const { data, loading, error } = useProjectBudgetQuery({
    variables: { id: projectId },
  });
  const [
    updateBudgetRecord,
    { loading: isUpdateLoading },
  ] = useUpdateProjectBudgetRecordMutation();

  const budgetRecordIdInUpdate = useRef<string>();

  const budget = data?.project.budget;
  const records: readonly BudgetRecord[] = budget?.value?.records ?? [];

  const budgetTotal = sumBy(records, (record) => record.amount.value ?? 0);

  const rowData = records.map<BudgetRowData>((record) => ({
    id: record.id,
    organization: record.organization.value?.name.value ?? '',
    fiscalYear: String(record.fiscalYear.value),
    amount: String(record.amount.value ?? ''),
    canEdit: record.amount.canEdit,
  }));

  const blankAmount = 'click to edit';
  const columns: Array<Column<BudgetRowData>> = useMemo(
    () => [
      {
        field: 'id',
        hidden: true,
      },
      {
        field: 'organization',
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
        render: (rowData) => {
          if (isUpdateLoading && rowData.id === budgetRecordIdInUpdate.current)
            return <Skeleton width={60} />;
          return rowData.amount
            ? formatCurrency(Number(rowData.amount))
            : blankAmount;
        },
      },
      {
        field: 'canEdit',
        hidden: true,
      },
    ],
    [formatCurrency, isUpdateLoading]
  );

  return (
    <ContentContainer>
      {error ? (
        <Typography variant="h4">Error fetching Project Budget</Typography>
      ) : budget?.canRead === false ? (
        <Typography variant="h4">
          You do not have permission to view this project's budget
        </Typography>
      ) : (
        <>
          <Breadcrumbs>
            <ProjectBreadcrumb data={data?.project} />
            <Breadcrumb to=".">Budget</Breadcrumb>
          </Breadcrumbs>
          <header className={classes.header}>
            <Typography variant="h2">Budget</Typography>
            <Typography
              variant="h3"
              className={loading ? classes.totalLoading : undefined}
            >
              {!loading && !isUpdateLoading ? (
                `Total: ${formatCurrency(budgetTotal)}`
              ) : (
                <Skeleton width={120} />
              )}
            </Typography>
          </header>
          <div className={classes.tableWrapper}>
            <Table
              data={rowData}
              columns={columns}
              isLoading={loading}
              components={tableComponents}
              cellEditable={
                budget?.canEdit
                  ? {
                      onCellEditApproved: async (newAmount, _, data) => {
                        if (newAmount === blankAmount || newAmount === '')
                          return;
                        budgetRecordIdInUpdate.current = data.id;
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
            />
          </div>
        </>
      )}
    </ContentContainer>
  );
};
