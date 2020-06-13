import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { DateTime } from 'luxon';
import React from 'react';
import { useParams } from 'react-router-dom';
// import { BudgetRecord } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ContentContainer as Content } from '../../../components/ContentContainer';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { RecordsTable, RowData } from '../RecordsTable';
import {
  ProjectBudgetQueryResult,
  /* useProjectBudgetQuery, */
} from './ProjectBudget.generated';

export const TEMP_BUDGET_QUERY_RETURN: Pick<
  ProjectBudgetQueryResult,
  'data' | 'loading' | 'error'
> = {
  loading: false,
  error: undefined,
  data: {
    project: {
      id: '234567',
      name: {
        canEdit: true,
        canRead: true,
        value: 'Pei language - phase 1',
      },
      deptId: {
        canEdit: true,
        canRead: true,
        value: '123456',
      },
      budget: {
        canEdit: true,
        canRead: true,
        value: {
          id: '345678',
          createdAt: DateTime.local(),
          total: 34034,
          records: [
            {
              id: '456789',
              createdAt: DateTime.local(),
              amount: {
                canEdit: true,
                canRead: true,
                value: 29000,
              },
              fiscalYear: {
                canEdit: true,
                canRead: true,
                value: 2021,
              },
              organization: {
                canEdit: true,
                canRead: true,
                value: {
                  id: '123456',
                  createdAt: DateTime.local(),
                  name: {
                    canEdit: true,
                    canRead: true,
                    value: 'Ethnos360',
                  },
                },
              },
            },
            {
              id: '567890',
              createdAt: DateTime.local(),
              amount: {
                canEdit: false,
                canRead: true,
                value: 3021,
              },
              fiscalYear: {
                canEdit: true,
                canRead: true,
                value: 2020,
              },
              organization: {
                canEdit: true,
                canRead: true,
                value: {
                  id: '234567',
                  createdAt: DateTime.local(),
                  name: {
                    canEdit: true,
                    canRead: true,
                    value: 'Seed Company',
                  },
                },
              },
            },
            {
              id: '012345',
              createdAt: DateTime.local(),
              amount: {
                canEdit: true,
                canRead: true,
                value: 2013,
              },
              fiscalYear: {
                canEdit: true,
                canRead: true,
                value: 2020,
              },
              organization: {
                canEdit: true,
                canRead: true,
                value: {
                  id: '345678',
                  createdAt: DateTime.local(),
                  name: {
                    canEdit: true,
                    canRead: true,
                    value: 'Ethnos360',
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
};

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
}));

export const ProjectBudget = () => {
  const { projectId } = useParams();
  // const { data, loading, error } = useProjectBudgetQuery({
  //   variables: { id: projectId },
  // });
  const classes = useStyles();
  const formatCurrency = useCurrencyFormatter();
  const { data, loading, error } = TEMP_BUDGET_QUERY_RETURN;

  const projectName = data?.project?.name.value;
  const budget = data?.project?.budget.value;
  const total = budget?.total;
  const canEditBudget = data?.project?.budget.canEdit;
  const budgetRecords = budget?.records ?? [];

  const rowData = budgetRecords.reduce((rows: RowData[], record) => {
    const { amount, fiscalYear, organization } = record;
    const { value: dollarAmount, canEdit } = amount;
    const { value: year } = fiscalYear;
    const orgName = organization?.value?.name.value;

    const row = {
      organization: orgName ?? '',
      fiscalYear: year ?? '',
      amount: dollarAmount ?? '',
      canEdit,
    };
    return rows.concat(row);
  }, []);

  const columns = [
    {
      title: 'Organization',
      field: 'organization',
      editable: 'never' as const,
    },
    {
      title: 'Fiscal Year',
      field: 'fiscalYear',
      editable: 'never' as const,
      render: (rowData: RowData) => `FY${rowData.fiscalYear}`,
    },
    {
      title: 'Amount',
      field: 'amount',
      type: 'currency' as const,
      editable: (_: unknown, rowData: RowData) => !!rowData.canEdit,
    },
    {
      title: '',
      field: 'canEdit',
      hidden: true,
    },
  ];

  function handleRowUpdate(newData: RowData) {
    return new Promise((resolve, reject) => {
      console.log(newData);
      resolve();
      if (!newData) {
        reject();
      }
    });
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
                  {data?.project.name?.value} Budget
                </Typography>
                {total ? (
                  <Typography variant="body1" className={classes.total}>
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
              <RecordsTable
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
