import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { useParams } from 'react-router-dom';
import { GQLOperations } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ContentContainer as Content } from '../../../components/ContentContainer';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
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
  total: {
    fontSize: '1.5rem',
  },
  tableWrapper: {
    marginTop: spacing(4),
  },
  toolbar: {
    padding: spacing(2),
    paddingBottom: spacing(1),
  },
}));

export const ProjectBudget = () => {
  const { projectId } = useParams();
  const classes = useStyles();
  const formatCurrency = useCurrencyFormatter();

  const { data, loading, error } = useProjectBudgetQuery({
    variables: { id: projectId },
  });
  const [updateBudgetRecord] = useUpdateProjectBudgetRecordMutation();

  const projectName = data?.project.name.value;
  const canReadBudget = data?.project.budget.canRead;
  const canEditBudget = data?.project.budget.canEdit;
  const budget = data?.project.budget.value;
  const budgetRecords = budget?.records ?? [];

  interface BudgetRowData {
    id: string;
    organization: string;
    fiscalYear: string;
    amount: string;
    canEdit: boolean;
  }

  const rowData = budgetRecords.reduce((rows: BudgetRowData[], record) => {
    const { amount, fiscalYear, id, organization } = record;
    const { value: dollarAmount, canEdit } = amount;
    const { value: year } = fiscalYear;
    const orgName = organization.value?.name.value;

    const row = {
      id,
      organization: orgName ?? '',
      fiscalYear: String(year),
      amount: String(dollarAmount),
      canEdit,
    };
    return rows.concat(row);
  }, []);

  const columns = [
    {
      title: 'ID',
      field: 'id',
      hidden: true,
    },
    {
      title: 'Organization',
      field: 'organization',
      editable: 'never' as const,
    },
    {
      title: 'Fiscal Year',
      field: 'fiscalYear',
      editable: 'never' as const,
      render: (rowData: BudgetRowData) => `FY${rowData.fiscalYear}`,
    },
    {
      title: 'Amount',
      field: 'amount',
      type: 'currency' as const,
      editable: (_: unknown, rowData: BudgetRowData) => rowData.canEdit,
      cellStyle: {
        display: 'flex',
        flexDirection: 'row' as const,
        justifyContent: 'flex-end',
      },
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
              <Breadcrumb to="/projects">Projects</Breadcrumb>
              <Breadcrumb to={`/projects/${projectId}`}>
                {projectName}
              </Breadcrumb>
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
                  <Typography variant="body1" className={classes.total}>
                    Total: {formatCurrency(budget.total)}
                  </Typography>
                )}
              </>
            )}
          </header>
          <section className={classes.tableWrapper}>
            {loading ? (
              <Skeleton variant="rect" width="100%" height={200} />
            ) : (
              <Table
                data={rowData}
                columns={columns}
                cellEditable={
                  canEditBudget
                    ? {
                        onCellEditApproved: async (newAmount, _, data) => {
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
            )}
          </section>
        </>
      )}
    </Content>
  );
};
