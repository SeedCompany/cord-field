import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { sumBy } from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { ContentContainer as Content } from '../../../components/Layout/ContentContainer';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { useProjectBudgetQuery } from './ProjectBudget.generated';
import { ProjectBudgetRecords } from './ProjectBudgetRecords';

const useStyles = makeStyles(({ spacing }) => ({
  header: {
    margin: spacing(3, 0),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalLoading: {
    width: '10%',
  },
}));

export const ProjectBudget = () => {
  const classes = useStyles();
  const { projectId } = useParams();
  const formatCurrency = useCurrencyFormatter();

  const { data, loading, error } = useProjectBudgetQuery({
    variables: { id: projectId },
  });

  const budget = data?.project.budget;

  const budgetTotal = sumBy(
    budget?.value?.records,
    (record) => record.amount.value ?? 0
  );

  return (
    <Content>
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
            <Breadcrumb to=".">Field Budget</Breadcrumb>
          </Breadcrumbs>
          <header className={classes.header}>
            <Typography variant="h2">Budget</Typography>
            <Typography
              variant="h3"
              className={loading ? classes.totalLoading : undefined}
            >
              {!loading ? (
                `Total: ${formatCurrency(budgetTotal)}`
              ) : (
                <Skeleton width="100%" />
              )}
            </Typography>
          </header>
          <ProjectBudgetRecords loading={loading} budget={budget} />
        </>
      )}
    </Content>
  );
};
