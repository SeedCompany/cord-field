import { useQuery } from '@apollo/client';
import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { capitalize } from 'lodash';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DataButton } from '../../../components/DataButton';
import {
  useDateFormatter,
  useFiscalMonthFormater,
  useFiscalQuarterFormater,
} from '../../../components/Formatters';
import {
  PeriodicReportsList,
  ReportRow,
} from '../../../components/PeriodicReportsList';
import { PeriodicReportListFragment } from '../../../components/PeriodicReportSummaryCard';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { SensitivityIcon } from '../../../components/Sensitivity';
import { ProjectOverviewDocument } from '../Overview/ProjectOverview.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
    maxWidth: breakpoints.values.md,
  },
  subheader: {
    marginTop: spacing(2.5),
  },
  header: {
    display: 'flex',
    maxWidth: breakpoints.values.md,
  },
  reportName: {
    marginRight: spacing(3),
  },
  table: {
    padding: spacing(4, 0),
  },
}));

export const Reports: FC = () => {
  const classes = useStyles();
  const { projectId = '', reportType = '' } = useParams();
  const { data } = useQuery(ProjectOverviewDocument, {
    variables: {
      input: projectId,
    },
  });
  const fiscalQuarterFormatter = useFiscalQuarterFormater();
  const fiscalMonthFormatter = useFiscalMonthFormater();
  const dateFormatter = useDateFormatter();

  const reportTypeName = `${capitalize(reportType)} Reports`;

  const reports =
    reportType === 'financial'
      ? data?.project.financialReports
      : reportType === 'narrative'
      ? ((data?.project as any).narrativeReports as PeriodicReportListFragment)
      : null;
  const isMonthlyReport =
    reportType === 'financial' &&
    data?.project.financialReportPeriod.value === 'Monthly';

  const rowsData: ReportRow[] =
    reports?.items.map((item) => ({
      id: item.id,
      period: isMonthlyReport
        ? fiscalMonthFormatter(item.start)
        : fiscalQuarterFormatter(item.start),
      start: item.start,
      modifiedBy: item.reportFile.value?.modifiedBy.fullName || '',
      modifiedAt: dateFormatter(item.reportFile.value?.modifiedAt),
      item,
    })) || [];

  return (
    <div className={classes.root}>
      <Helmet
        title={`${reportTypeName} - ${data?.project.name.value ?? 'A Project'}`}
      />
      <Breadcrumbs>
        <ProjectBreadcrumb data={data?.project} />
        <Breadcrumb to=".">{reportTypeName}</Breadcrumb>
      </Breadcrumbs>

      <header className={classes.subheader}>
        <Typography variant="h4">
          {data ? data.project.name.value : <Skeleton width={200} />}
        </Typography>
      </header>
      <header className={classes.header}>
        <Typography variant="h2" className={classes.reportName}>
          {reportTypeName}
        </Typography>
        <DataButton
          loading={!data}
          startIcon={
            <SensitivityIcon
              value={data?.project.sensitivity}
              loading={!data}
              disableTooltip
            />
          }
        >
          {data ? `${data.project.sensitivity} Sensitivity` : null}
        </DataButton>
      </header>

      <div className={classes.table}>
        <PeriodicReportsList data={rowsData} />
      </div>
    </div>
  );
};
