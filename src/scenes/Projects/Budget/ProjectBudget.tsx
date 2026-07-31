import { useQuery } from '@apollo/client';
import { InfoOutlined, LockOutlined, WarningAmber } from '@mui/icons-material';
import { TabContext, TabPanel } from '@mui/lab';
import {
  Alert,
  Box,
  Breadcrumbs,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { sortBy } from '@seedcompany/common';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DisplaySimpleProperty } from '../../../components/DisplaySimpleProperty';
import { Error } from '../../../components/Error';
import { FormattedDateRange } from '../../../components/Formatters/FormattedDate';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { ContentContainer as Content } from '../../../components/Layout/ContentContainer';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Tab, TabList, TabsContainer } from '../../../components/Tabs';
import { useDetailTabs } from '../../../hooks';
import { useProjectId } from '../useProjectId';
import { BudgetApprovalStatsTab } from './BudgetApprovalStatsTab';
import { BudgetAssumptionsFields } from './BudgetAssumptionsFields';
import { BudgetBreakdown } from './BudgetBreakdown';
import {
  effectiveDisplayCurrencyMode,
  formatPercent,
} from './budgetLineHelpers';
import { BudgetPartnerLedger } from './BudgetPartnerLedger';
import { LanguageEngagementsSummary } from './LanguageEngagementsSummary';
import { OtherPartnerContributionsGrid } from './OtherPartnerContributionsGrid';
import { PartnersSummary } from './PartnersSummary';
import { ProjectBudgetDocument } from './ProjectBudget.graphql';
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
    alignItems: 'flex-start',
    // budget-line-items-poc: widened from `md` to `lg` (matches
    // `pocWrapper` below) -- the two-totals cluster + caption need more
    // room than the original single "Total: $X" did.
    maxWidth: breakpoints.values.lg,
  },
  totalLoading: {
    width: '10%',
  },
  // budget-line-items-poc: this slot used to hold the always-visible
  // ProjectBudgetRecords grid + Universal Template card (both now live in
  // the "Funding Budget" tab) -- repurposed for the always-visible facts
  // rows (MOU dates / Country / Currency / Primary Funding Partner /
  // Partners, plus the Assumptions fields row) instead of introducing a
  // new container.
  factsRow: {
    maxWidth: breakpoints.values.lg,
    margin: spacing(0, 4, 3, 0),
  },
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

  const [activeTab, setTab] = useDetailTabs(
    [
      'budget',
      'otherContributions',
      'stats',
      'breakdown',
      'partners',
      'funding',
    ],
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

  // budget-line-items-poc (item 3): partner orgs for the header's "Partners"
  // popover -- deduped by organization like `partnerOrganizations` above,
  // but kept as a separate memo since that one drives the grid pickers and
  // intentionally omits the Partner entity's own id (`partnerId` here),
  // which `/partners/:id` links actually need (see ProjectBudget.graphql's
  // comment on `partnerships`).
  const partnersForSummary = useMemo(() => {
    const items = data?.project.partnerships.items ?? [];
    const byOrgId = new Map<string, { name: string; partnerId: string }>();
    for (const item of items) {
      const partner = item.partner.value;
      const org = partner?.organization.value;
      if (partner && org) {
        byOrgId.set(org.id, {
          name: org.name.value ?? org.id,
          partnerId: partner.id,
        });
      }
    }
    return sortBy(
      Array.from(byOrgId, ([id, { name, partnerId }]) => ({
        id,
        name,
        partnerId,
      })),
      (o) => o.name
    );
  }, [data]);

  // budget-line-items-poc (item 4): best-effort primary-funder name for the
  // "Total cash — {funder}" stats row. Resolves to null under the current
  // Postgres/Drizzle path (see ProjectBudget.graphql's comment) --
  // BudgetApprovalStatsTab falls back to a generic label in that case.
  const funderName =
    data?.project.primaryPartnership.value?.partner.value?.organization.value
      ?.name.value ?? null;

  // budget-line-items-poc (item 7): the project's MOU dates, read-only.
  const projectMouStart = data?.project.mouStart.value ?? null;
  const projectMouEnd = data?.project.mouEnd.value ?? null;

  // Both totals shown in the always-visible header (see the header's
  // `totalsCaption`/tooltip below for why these two can legitimately
  // disagree).
  const fieldBudgetTotal = budget?.value?.calculationSummary?.totals.grandTotal;
  const fundingBudgetTotal = budget?.value?.total;
  const totalsMismatch =
    fieldBudgetTotal != null &&
    fundingBudgetTotal != null &&
    Math.abs(fundingBudgetTotal - fieldBudgetTotal) > 0.01;

  const currencyMode = effectiveDisplayCurrencyMode(budget?.value ?? undefined);
  const exchangeRate = budget?.value?.exchangeRate.value ?? null;
  const currencyForced = budget?.value?.sensitivity === 'High';
  const currencyTooltip = `Entry currency: ${
    budget?.value?.entryCurrencyMode.value ?? '—'
  }. Display currency: ${currencyMode ?? '—'}.${
    currencyForced
      ? ' Forced to the entry currency — this budget is High sensitivity.'
      : ''
  }`;

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
            <Typography variant="h2">Field Budget</Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'flex-start', sm: 'flex-end' },
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'baseline' }}
              >
                <Typography
                  variant="h3"
                  className={loading ? classes.totalLoading : undefined}
                >
                  {loading ? (
                    <Skeleton width="100%" />
                  ) : fieldBudgetTotal != null ? (
                    `Field Budget Total: ${formatCurrency(fieldBudgetTotal)}`
                  ) : (
                    <Tooltip title="Set the project's MOU dates to calculate this">
                      <span>Field Budget Total: —</span>
                    </Tooltip>
                  )}
                </Typography>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                />
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    className={loading ? classes.totalLoading : undefined}
                  >
                    {loading ? (
                      <Skeleton width="100%" />
                    ) : (
                      `Funding Budget Total: ${
                        fundingBudgetTotal != null
                          ? formatCurrency(fundingBudgetTotal)
                          : '—'
                      }`
                    )}
                  </Typography>
                  {!loading ? (
                    <Tooltip title="Funding Budget Total is Financial Services' officially tracked, per-partner approved funding amount (see the Funding Budget tab). Field Budget Total is the sum of this project's itemized line items — cash + in-kind + admin fee. A backend sync keeps them aligned automatically, but only for line items with an explicit funder assigned, so a partner that only contributes as an Other Partner Contribution donor can keep an independent, potentially stale Funding Budget amount.">
                      <InfoOutlined fontSize="inherit" color="action" />
                    </Tooltip>
                  ) : null}
                  {!loading && totalsMismatch ? (
                    <Chip
                      label="Review sync"
                      size="small"
                      color="warning"
                      icon={<WarningAmber />}
                      onClick={() => setTab('funding')}
                    />
                  ) : null}
                </Stack>
              </Stack>
              {!loading ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, textAlign: { xs: 'left', sm: 'right' } }}
                >
                  Two separate totals, tracked independently — hover ⓘ for why
                  they can differ.
                </Typography>
              ) : null}
            </Box>
          </header>
          {/* budget-line-items-poc: relocated from the top of the Field
              Budget tab's stat-card row (now the "Budget Approval Stats"
              tab's BudgetApprovalStatsTab) so these read on every tab, not
              just Field Budget -- grouped with Language Engagements since
              Cost Per Language's denominator IS that count. Guarded the same
              way BudgetApprovalStatsTab itself guards this data: no
              calculationSummary means the project has no MOU dates set yet,
              so there's nothing to show. */}
          {budget?.value?.calculationSummary ? (
            <div className={classes.factsRow}>
              <Stack
                direction="row"
                flexWrap="wrap"
                spacing={3}
                alignItems="center"
              >
                <DisplaySimpleProperty
                  label="Bible Translation %"
                  value={formatPercent(
                    budget.value.calculationSummary.bibleTranslationPercent
                  )}
                />
                <DisplaySimpleProperty
                  label="Funder Bible Translation %"
                  value={formatPercent(
                    budget.value.calculationSummary
                      .funderBibleTranslationPercent
                  )}
                />
                <DisplaySimpleProperty
                  label="Cost Per Language"
                  value={formatCurrency(
                    budget.value.calculationSummary.costPerLanguage
                  )}
                />
                <LanguageEngagementsSummary
                  count={budget.value.languageCount.value ?? 0}
                  engagements={data?.project.engagements.items ?? []}
                />
              </Stack>
            </div>
          ) : null}
          <div className={classes.factsRow}>
            <Stack
              direction="row"
              flexWrap="wrap"
              spacing={3}
              alignItems="center"
            >
              <DisplaySimpleProperty
                label="Project Dates (MOU)"
                value={
                  projectMouStart || projectMouEnd ? (
                    <FormattedDateRange
                      start={projectMouStart}
                      end={projectMouEnd}
                    />
                  ) : undefined
                }
              />
              {budget?.value?.country.canRead ? (
                budget.value.sensitivity === 'High' ? (
                  // budget-line-items-poc: matches the prototype's masking
                  // model (app.js `buildCountrySelect()`/`displayCcy()`,
                  // index.html's `.country-private`/`.privacy-chip`) -- a
                  // frontend-only display convention, not real access
                  // control. The real country name is still fetched by this
                  // query same as before; this only changes what it renders
                  // as. A persistent chip (not just a tooltip) so the
                  // masking is obvious at a glance.
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Country:&nbsp;
                    </Typography>
                    <Tooltip title="This budget is High sensitivity — the country is masked in the UI.">
                      <Chip
                        icon={<LockOutlined fontSize="small" />}
                        label="Private"
                        size="small"
                        variant="outlined"
                      />
                    </Tooltip>
                  </Stack>
                ) : (
                  <DisplaySimpleProperty
                    label="Country"
                    value={budget.value.country.value?.name}
                  />
                )
              ) : null}
              {budget?.value?.entryCurrencyMode.canRead ? (
                <DisplaySimpleProperty
                  label="Currency"
                  value={
                    currencyMode === 'Local'
                      ? currencyForced
                        ? // budget-line-items-poc: never reveal the real
                          // currency code or numeric exchange rate at High
                          // sensitivity (matches the prototype's
                          // `displayCcy()`, which always returns the generic
                          // "Local currency" and never the ccy code, plus
                          // `renderSummary()`'s cap-figure suppression for
                          // the same reasoning) -- UI-only, same caveat as
                          // the Country chip above.
                          'Private (local currency)'
                        : `Local · 1 USD = ${
                            exchangeRate != null ? exchangeRate.toFixed(4) : '—'
                          }`
                      : currencyMode === 'USD'
                      ? 'USD'
                      : undefined
                  }
                  ValueProps={{
                    color:
                      currencyMode === 'Local' ? 'warning.main' : undefined,
                    fontWeight: currencyMode === 'Local' ? 700 : undefined,
                  }}
                  wrap={(node) => (
                    <Tooltip title={currencyTooltip}>{node}</Tooltip>
                  )}
                />
              ) : null}
              {funderName ? (
                <DisplaySimpleProperty
                  label="Primary Funding Partner"
                  value={funderName}
                />
              ) : null}
              <PartnersSummary
                partners={partnersForSummary}
                projectId={projectId}
              />
            </Stack>
          </div>
          {/* budget-line-items-poc (item 4): the 5 editable Budget
              assumption fields, relocated from a Card on the Field Budget
              tab into this always-visible header row -- see
              BudgetAssumptionsFields.tsx. */}
          {budget?.value ? (
            <div className={classes.factsRow}>
              <BudgetAssumptionsFields budget={budget.value} />
            </div>
          ) : null}

          {/* budget-line-items-poc additions */}
          {budget?.value ? (
            <div className={classes.pocWrapper}>
              <TabsContainer>
                <TabContext value={activeTab}>
                  <TabList
                    onChange={(_e, tab) => setTab(tab)}
                    aria-label="budget navigation tabs"
                  >
                    <Tab label="Field Budget" value="budget" />
                    <Tab
                      label="Other Partner Contributions"
                      value="otherContributions"
                    />
                    <Tab label="Budget Approval Stats" value="stats" />
                    <Tab label="Breakdown" value="breakdown" />
                    <Tab label="Partner Budgets" value="partners" />
                    <Tab label="Funding Budget" value="funding" />
                  </TabList>
                  <TabPanel value="budget">
                    <ProjectBudgetLineItems
                      loading={loading}
                      budget={budget.value}
                      partnerOrganizations={partnerOrganizations}
                    />
                  </TabPanel>
                  <TabPanel value="otherContributions">
                    <OtherPartnerContributionsGrid
                      loading={loading}
                      budget={budget.value}
                      partnerOrganizations={partnerOrganizations}
                    />
                  </TabPanel>
                  <TabPanel value="stats">
                    <BudgetApprovalStatsTab
                      budget={budget.value}
                      funderName={funderName}
                      projectMouStart={projectMouStart}
                      projectMouEnd={projectMouEnd}
                    />
                  </TabPanel>
                  <TabPanel value="breakdown">
                    <BudgetBreakdown budget={budget.value} />
                  </TabPanel>
                  <TabPanel value="partners">
                    <BudgetPartnerLedger budget={budget.value} />
                  </TabPanel>
                  <TabPanel value="funding">
                    <Grid container direction="column" spacing={3}>
                      <Grid item>
                        <Alert severity="info">
                          This is Financial Services' approved per-partner
                          funding ledger — tracked and maintained separately
                          from the itemized Field Budget above. See the ⓘ next
                          to Funding Budget Total in the page header for how the
                          two relate.
                        </Alert>
                      </Grid>
                      <Grid item>
                        <ProjectBudgetRecords
                          loading={loading}
                          budget={budget}
                        />
                      </Grid>
                    </Grid>
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
