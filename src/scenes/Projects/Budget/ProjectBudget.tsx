import { useQuery } from '@apollo/client';
import { TabContext, TabPanel } from '@mui/lab';
import { Breadcrumbs, Grid, Skeleton, Typography } from '@mui/material';
import { sortBy } from '@seedcompany/common';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DefinedFileCard } from '../../../components/DefinedFileCard';
import { Error } from '../../../components/Error';
import { FileActionsContextProvider } from '../../../components/files/FileActions';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { ContentContainer as Content } from '../../../components/Layout/ContentContainer';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Tab, TabList, TabsContainer } from '../../../components/Tabs';
import { useDetailTabs } from '../../../hooks';
import { useProjectId } from '../useProjectId';
import { BudgetAssumptionsForm } from './BudgetAssumptionsForm';
import { BudgetBreakdown } from './BudgetBreakdown';
import { BudgetPartnerLedger } from './BudgetPartnerLedger';
import { BudgetSummaryPanel } from './BudgetSummaryPanel';
import { OtherPartnerContributionsGrid } from './OtherPartnerContributionsGrid';
import {
  ProjectBudgetDocument,
  UpdateProjectBudgetUniversalTemplateDocument,
} from './ProjectBudget.graphql';
import { ProjectBudgetLineItems } from './ProjectBudgetLineItems';
import { ProjectBudgetRecords } from './ProjectBudgetRecords';

const useStyles = makeStyles()(({ breakpoints, spacing }) => ({
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
  // budget-line-items-poc: the new sections (assumptions form, summary
  // cards, line-item grid) have more columns/content than the original
  // budget-records table, so they use the wider `lg` breakpoint instead of
  // `md`.
  pocWrapper: {
    maxWidth: breakpoints.values.lg,
    margin: spacing(0, 4, 4, 0),
  },
}));

export const ProjectBudget = () => {
  const { classes } = useStyles();
  const { projectId, changesetId } = useProjectId();
  const formatCurrency = useCurrencyFormatter();

  const { data, loading, error } = useQuery(ProjectBudgetDocument, {
    variables: { id: projectId, changeset: changesetId },
    fetchPolicy: 'cache-and-network',
  });

  const budget = data?.project.budget;

  const template = budget?.value?.universalTemplateFile;

  const [activeTab, setTab] = useDetailTabs(
    ['budget', 'breakdown', 'partners'],
    'budget'
  );

  // budget-line-items-poc (item 2 & 3): this project's own partnerships,
  // deduplicated by organization id -- sourced for the Service Provider /
  // Funder / Donor column pickers (scoped to the project, not a global org
  // search).
  const partnerOrganizations = useMemo(() => {
    const items = data?.project.partnerships.items ?? [];
    const byId = new Map<string, string>();
    for (const item of items) {
      const org = item.partner.value?.organization.value;
      if (org) {
        byId.set(org.id, org.name.value ?? org.id);
      }
    }
    return sortBy(
      Array.from(byId, ([id, name]) => ({ id, name })),
      (o) => o.name
    );
  }, [data]);

  // budget-line-items-poc (item 4): best-effort primary-funder name for the
  // "Total cash — {funder}" stats row. Resolves to null under the current
  // Postgres/Drizzle path (see ProjectBudget.graphql's comment) --
  // BudgetSummaryPanel falls back to a generic label in that case.
  const funderName =
    data?.project.primaryPartnership.value?.partner.value?.organization.value
      ?.name.value ?? null;

  // budget-line-items-poc (item 7): the project's MOU dates, read-only.
  const projectMouStart = data?.project.mouStart.value ?? null;
  const projectMouEnd = data?.project.mouEnd.value ?? null;

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

          {/* budget-line-items-poc additions */}
          {budget?.value ? (
            <div className={classes.pocWrapper}>
              <TabsContainer>
                <TabContext value={activeTab}>
                  <TabList
                    onChange={(_e, tab) => setTab(tab)}
                    aria-label="budget navigation tabs"
                  >
                    <Tab label="Budget" value="budget" />
                    <Tab label="Breakdown" value="breakdown" />
                    <Tab label="Partner Budgets" value="partners" />
                  </TabList>
                  <TabPanel value="budget">
                    <Grid container direction="column" spacing={3}>
                      <Grid item>
                        <BudgetAssumptionsForm
                          budget={budget.value}
                          projectMouStart={projectMouStart}
                          projectMouEnd={projectMouEnd}
                        />
                      </Grid>
                      <Grid item>
                        <BudgetSummaryPanel
                          budget={budget.value}
                          funderName={funderName}
                        />
                      </Grid>
                      <Grid item>
                        <ProjectBudgetLineItems
                          loading={loading}
                          budget={budget.value}
                          partnerOrganizations={partnerOrganizations}
                        />
                      </Grid>
                      <Grid item>
                        <OtherPartnerContributionsGrid
                          loading={loading}
                          budget={budget.value}
                          partnerOrganizations={partnerOrganizations}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value="breakdown">
                    <BudgetBreakdown budget={budget.value} />
                  </TabPanel>
                  <TabPanel value="partners">
                    <BudgetPartnerLedger budget={budget.value} />
                  </TabPanel>
                </TabContext>
              </TabsContainer>
            </div>
          ) : null}
        </>
      )}
    </Content>
  );
};
