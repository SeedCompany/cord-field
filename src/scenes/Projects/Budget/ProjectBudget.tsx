import {
  Breadcrumbs,
  makeStyles,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Column, MTableCell } from 'material-table';
import React from 'react';
import { useParams } from 'react-router-dom';
import { GQLOperations } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ContentContainer as Content } from '../../../components/ContentContainer';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Table } from '../../../components/Table';
import {
  useProjectBudgetQuery,
  useUpdateProjectBudgetRecordMutation,
} from './ProjectBudget.generated';

const useStyles = makeStyles(({ spacing }) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  tableWrapper: {
    marginTop: spacing(4),
  },
  toolbar: {
    padding: spacing(2),
    paddingBottom: spacing(1),
  },
}));

const TableCell = withStyles({
  root: {
    '& > div': {
      marginLeft: 'auto',
      marginRight: 0,
    },
  },
})(MTableCell);

export const ProjectBudget = () => {
  const { projectId } = useParams();
  const classes = useStyles();
  const formatCurrency = useCurrencyFormatter();

  const { data, loading, error } = useProjectBudgetQuery({
    variables: { id: projectId },
  });
  const [updateBudgetRecord] = useUpdateProjectBudgetRecordMutation();

  const canReadBudget = data?.project.budget.canRead;
  const canEditBudget = data?.project.budget.canEdit;
  const budget = data?.project.budget.value;
  const budgetRecords = budget?.records ?? [];

  interface BudgetRowData {
    id: string;
    organization: string;
    fiscalYear: string;
    amount: string | null;
    canEdit: boolean;
  }

  const blankAmount = 'click to edit';
  const rowData = budgetRecords.reduce((rows: BudgetRowData[], record) => {
    const { amount, fiscalYear, id, organization } = record;
    const { value: dollarAmount, canEdit } = amount;
    const { value: year } = fiscalYear;
    const orgName = organization.value?.name.value;

    const row = {
      id,
      organization: orgName ?? '',
      fiscalYear: String(year),
      amount: String(dollarAmount ?? ''),
      canEdit,
    };
    return rows.concat(row);
  }, []);

  const columns: Array<Column<BudgetRowData>> = [
    {
      title: 'ID',
      field: 'id',
      hidden: true,
    },
    {
      title: 'Organization',
      field: 'organization',
      editable: 'never',
    },
    {
      title: 'Fiscal Year',
      field: 'fiscalYear',
      editable: 'never',
      render: (rowData: BudgetRowData) => `FY${rowData.fiscalYear}`,
    },
    {
      title: 'Amount',
      field: 'amount',
      type: 'currency',
      editable: (_: unknown, rowData: BudgetRowData) => rowData.canEdit,
      render: (rowData: BudgetRowData) =>
        `${
          rowData.amount ? formatCurrency(Number(rowData.amount)) : blankAmount
        }`,
    },
    {
      title: 'Can Edit',
      field: 'canEdit',
      hidden: true,
    },
  ];

  return (
    <Content>
      {error ? (
        <Typography variant="h4">Error fetching Project Budget</Typography>
      ) : canReadBudget === false ? (
        <Typography variant="h4">
          You do not have permission to view this project's budget
        </Typography>
      ) : (
        <>
          {loading ? (
            <Skeleton variant="text" width="20%" />
          ) : (
            <Breadcrumbs>
              <ProjectBreadcrumb data={data?.project} />
              <Breadcrumb to=".">Budget</Breadcrumb>
            </Breadcrumbs>
          )}
          <header className={classes.header}>
            {loading ? (
              <>
                <Skeleton variant="text" width="20%" />
                <Skeleton variant="text" width="10%" />
              </>
            ) : (
              <>
                <Typography variant="h2">
                  {data?.project.name.value} Budget
                </Typography>
                {budget && (
                  <Typography variant="h3">
                    Total: {formatCurrency(budget.total)}
                  </Typography>
                )}
              </>
            )}
          </header>
          <section className={classes.tableWrapper}>
            <Table
              data={rowData}
              columns={columns}
              components={{
                Cell: (props) => <TableCell {...props} />,
              }}
              isLoading={loading}
              cellEditable={
                canEditBudget
                  ? {
                      onCellEditApproved: async (newAmount, _, data) => {
                        if (newAmount === blankAmount) return;
                        const input = {
                          budgetRecord: {
                            id: data.id,
                            amount: Number(newAmount),
                          },
                        };
                        await updateBudgetRecord({
                          variables: { input },
                          refetchQueries: [GQLOperations.Query.ProjectBudget],
                        });
                      },
                    }
                  : undefined
              }
            />
          </section>
        </>
      )}
    </Content>
  );
};
