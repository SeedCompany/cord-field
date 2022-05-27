import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { ReportType } from '../../api';
import { Breadcrumb } from '../Breadcrumb';
import { PeriodicReportFragment } from './PeriodicReport.graphql';
import { PeriodicReportsTable, ReportRow } from './PeriodicReportsTable';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
  },
  main: {
    padding: spacing(4),
    maxWidth: breakpoints.values.md,
  },
  header: {
    margin: spacing(3, 0),
  },
}));

export const PeriodicReportsList = ({
  type,
  breadcrumbs = [],
  pageTitleSuffix,
  reports,
  onRowClick,
  disableNewVersionAction,
}: {
  type: ReportType;
  breadcrumbs?: ReactNode[];
  pageTitleSuffix?: string;
  reports?: readonly PeriodicReportFragment[];
  onRowClick?: (rowData: ReportRow) => void;
  disableNewVersionAction?: boolean;
}) => {
  const classes = useStyles();
  const reportTypeName = `${type} Reports`;

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Helmet title={`${reportTypeName} - ${pageTitleSuffix}`} />
        <Breadcrumbs
          children={[
            ...breadcrumbs,
            <Breadcrumb to=".">{reportTypeName}</Breadcrumb>,
          ]}
        />

        <Typography variant="h2" className={classes.header}>
          {reportTypeName}
        </Typography>

        <PeriodicReportsTable
          data={reports}
          onRowClick={onRowClick}
          disableNewVersionAction={disableNewVersionAction}
        />
      </main>
    </div>
  );
};
