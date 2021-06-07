import { useQuery } from '@apollo/client';
import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DataButton } from '../../../components/DataButton';
import {
  useDateFormatter,
  useFiscalQuarterFormater,
} from '../../../components/Formatters';
import {
  PeriodicReportsList,
  ReportRow,
} from '../../../components/PeriodicReportsList';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { SensitivityIcon } from '../../../components/Sensitivity';
import { ProgressReportsDocument } from './EngagementReports.generated';

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
  const { projectId = '', engagementId = '' } = useParams();
  const { data } = useQuery(ProgressReportsDocument, {
    variables: {
      projectId,
      engagementId,
    },
  });
  const fiscalQuarterFormatter = useFiscalQuarterFormater();
  const dateFormatter = useDateFormatter();

  const reportTypeName = 'Progress Reports';

  if (data?.engagement.__typename !== 'LanguageEngagement') {
    return null;
  }

  const reports = data.engagement.progressReports;

  const rowsData: ReportRow[] = reports.items.map((item) => ({
    id: item.id,
    period: fiscalQuarterFormatter(item.start),
    start: item.start,
    modifiedBy: item.reportFile.value?.modifiedBy.fullName || '',
    modifiedAt: dateFormatter(item.reportFile.value?.modifiedAt),
    item,
  }));

  const engagementName = data.engagement.language.value?.displayName.value;

  return (
    <div className={classes.root}>
      <Helmet
        title={`${reportTypeName} - ${data.project.name.value ?? 'A Project'}`}
      />
      <Breadcrumbs>
        <ProjectBreadcrumb data={data.project} />
        {engagementName && (
          <Breadcrumb
            to={`/projects/${data.project.id}/engagements/${data.engagement.id}`}
          >
            {engagementName}
          </Breadcrumb>
        )}
        <Breadcrumb to=".">{reportTypeName}</Breadcrumb>
      </Breadcrumbs>

      <header className={classes.subheader}>
        <Typography variant="h4">{data.project.name.value}</Typography>
      </header>
      <header className={classes.header}>
        <Typography variant="h2" className={classes.reportName}>
          {reportTypeName}
        </Typography>
        <DataButton
          loading={!data}
          startIcon={
            <SensitivityIcon
              value={data.project.sensitivity}
              loading={!data}
              disableTooltip
            />
          }
        >
          {data.project.sensitivity} Sensitivity
        </DataButton>
      </header>

      <div className={classes.table}>
        <PeriodicReportsList data={rowsData} />
      </div>
    </div>
  );
};
