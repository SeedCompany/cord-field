import { useQuery } from '@apollo/client';
import { Breadcrumbs, Grid, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DefinedFileCard } from '../../../components/DefinedFileCard';
import { Error } from '../../../components/Error';
import { FileActionsContextProvider } from '../../../components/files/FileActions';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { ContentContainer as Content } from '../../../components/Layout/ContentContainer';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Table } from '../../../components/Table';
import { useProjectId } from '../useProjectId';
import {
  ProjectBudgetDocument,
  UpdateProjectBudgetUniversalTemplateDocument,
} from './ProjectBudget.generated';
import { ProjectBudgetRecords } from './ProjectBudgetRecords';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    overflowY: 'auto',
  },
  header: {
    margin: spacing(3, 4, 3, 0),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    maxWidth: breakpoints.values.md,
  },
  totalLoading: {
    width: '10%',
  },
  tableWrapper: {
    maxWidth: breakpoints.values.md,
    margin: spacing(0, 4, 4, 0),
  },
}));

export const ProjectBudget = () => {
  const classes = useStyles();
  const { projectId, changesetId } = useProjectId();
  const formatCurrency = useCurrencyFormatter();

  const { data, loading, error } = useQuery(ProjectBudgetDocument, {
    variables: { id: projectId, changeset: changesetId },
  });

  // Don't wait for data to load table js code
  useEffect(() => Table.preload(), []);

  const budget = data?.project.budget;

  const template = budget?.value?.universalTemplateFile;

  return (
    <Content className={classes.root}>
      <Helmet title={`Budget - ${data?.project.name.value ?? 'A Project'}`} />
      {error ? (
        <Error error={error}>
          {{
            NotFound: "Could not find project's field budget",
            Default: "Error loading project's field budget",
          }}
        </Error>
      ) : budget?.canRead === false ? (
        <Error show>
          You do not have permission to view this project's field budget
        </Error>
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
              {!loading && budget?.value?.total != null ? (
                `Total: ${formatCurrency(budget.value.total)}`
              ) : (
                <Skeleton width="100%" />
              )}
            </Typography>
          </header>
          <div className={classes.tableWrapper}>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <ProjectBudgetRecords loading={loading} budget={budget} />
              </Grid>
              {!budget?.value || !template || !template.canRead ? null : (
                <FileActionsContextProvider>
                  <Grid item xs={6}>
                    <DefinedFileCard
                      label="Universal Template"
                      parentId={budget.value.id}
                      uploadMutationDocument={
                        UpdateProjectBudgetUniversalTemplateDocument
                      }
                      resourceType="budget"
                      securedFile={template}
                    />
                  </Grid>
                </FileActionsContextProvider>
              )}
            </Grid>
          </div>
        </>
      )}
    </Content>
  );
};
