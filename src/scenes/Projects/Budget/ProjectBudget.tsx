import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ContentContainer as Content } from '../../../components/ContentContainer';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { Table } from '../../../components/Table';
import { useProjectBudgetQuery } from './ProjectBudget.generated';

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

  const projectName = data?.project.name.value;
  const budget = data?.project.budget.value;
  const total = budget?.total;
  const canEditBudget = data?.project.budget.canEdit;
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
      editable: (_: unknown, rowData: BudgetRowData) => !!rowData.canEdit,
    },
    {
      title: 'Can Edit',
      field: 'canEdit',
      hidden: true,
    },
  ];

  function handleRowUpdate(data: BudgetRowData): Promise<void> {
    return new Promise((resolve) => resolve(console.log(data)));
  }

  return (
    <Content>
      {error || !budget ? (
        <Typography variant="h4">Error fetching Project Budget</Typography>
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
                {total ? (
                  <Typography variant="body1" className={classes.total}>
                    {/* This will get updated with a refetch after the mutation */}
                    Total: {formatCurrency(total)}
                  </Typography>
                ) : null}
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
                isEditable={canEditBudget}
                onRowUpdate={handleRowUpdate}
              />
            )}
          </section>
        </>
      )}
    </Content>
  );
};
