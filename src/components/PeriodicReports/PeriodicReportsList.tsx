import { Breadcrumbs, Card, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
import { ReportType } from '~/api/schema.graphql';
import { Breadcrumb } from '../Breadcrumb';
import { PeriodicReportFragment } from './PeriodicReport.graphql';
import { PeriodicReportsTable } from './PeriodicReportsTable';

const useStyles = makeStyles()(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    padding: spacing(4),
    maxWidth: breakpoints.values.md,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    margin: spacing(3, 0),
  },
}));

export const PeriodicReportsList = ({
  type,
  breadcrumbs = [],
  pageTitleSuffix,
  children,
  reports,
  onRowClick,
}: {
  type: ReportType;
  breadcrumbs?: ReactNode[];
  pageTitleSuffix?: string;
  children?: ReactNode;
  reports?: readonly PeriodicReportFragment[];
  onRowClick?: (report: PeriodicReportFragment) => void;
}) => {
  const { classes } = useStyles();
  const reportTypeName = `${type} Reports`;

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Helmet title={`${reportTypeName} - ${pageTitleSuffix}`} />
        <Breadcrumbs
          children={[
            ...breadcrumbs,
            <Breadcrumb to="." key="report">
              {reportTypeName}
            </Breadcrumb>,
          ]}
        />

        <Typography variant="h2" className={classes.header}>
          {reportTypeName}
        </Typography>

        <Card>
          {children ?? (
            <PeriodicReportsTable
              data={reports}
              onRowClick={
                onRowClick ? (params) => onRowClick(params.row) : undefined
              }
            />
          )}
        </Card>
      </main>
    </div>
  );
};
