import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
// import { BudgetRecord, Budget } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ContentContainer as Content } from '../../../components/ContentContainer';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { RowData, Table } from '../../../components/Table';
import {
  ProjectBudgetQueryResult,
  useProjectBudgetQuery,
} from './ProjectBudget.generated';

type MockQueryReturn = Pick<
  ProjectBudgetQueryResult,
  'data' | 'loading' | 'error'
>;

export const MOCK_QUERY_RETURN: MockQueryReturn = {
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
  const classes = useStyles();
  const formatCurrency = useCurrencyFormatter();

  const {
    data: budgetData,
    // loading: budgetLoading,
    // error: budgetError,
  } = useProjectBudgetQuery({
    variables: { id: projectId },
  });
  console.log('records', budgetData?.project.budget.value?.records);
  const [mock, setMock] = useState<MockQueryReturn>(MOCK_QUERY_RETURN);

  const { data, loading, error } = mock;

  const projectName = data?.project?.name.value;
  const budget = data?.project?.budget.value;
  const total = budget?.total;
  const canEditBudget = data?.project?.budget.canEdit;
  const budgetRecords = budget?.records ?? [];

  const rowData = budgetRecords.reduce((rows: RowData[], record) => {
    const { amount, fiscalYear, id, organization } = record;
    const { value: dollarAmount, canEdit } = amount;
    const { value: year } = fiscalYear;
    const orgName = organization?.value?.name.value;

    const row = {
      id,
      organization: orgName ?? '',
      fiscalYear: year ?? '',
      amount: dollarAmount ?? '',
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
      render: (rowData: RowData) => `FY${rowData.fiscalYear}`,
    },
    {
      title: 'Amount',
      field: 'amount',
      type: 'currency' as const,
      editable: (_: unknown, rowData: RowData) => !!rowData.canEdit,
    },
    {
      title: 'Can Edit',
      field: 'canEdit',
      hidden: true,
    },
  ];

  function handleRowUpdate(data: RowData) {
    // We'll totally redo this when we have a working query + mutation
    const records = mock.data?.project.budget.value?.records ?? [];
    const index = records.findIndex((record) => record.id === data.id);
    const updatedRecord =
      index > -1
        ? {
            ...records[index],
            amount: {
              ...records[index].amount,
              value: data.amount as number,
            },
          }
        : undefined;
    const updatedRecords = updatedRecord
      ? records
          .slice(0, index)
          .concat(updatedRecord)
          .concat(records.slice(index + 1))
      : records;
    return new Promise((resolve) =>
      resolve(
        setMock((mock) => ({
          ...mock,
          data: {
            ...mock.data!,
            project: {
              ...mock.data!.project,
              budget: {
                ...mock.data!.project.budget,
                value: {
                  ...mock.data!.project.budget.value!,
                  records: updatedRecords,
                },
              },
            },
          },
        }))
      )
    );
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
                title="Budget Records"
              />
            )}
          </section>
        </>
      )}
    </Content>
  );
};
