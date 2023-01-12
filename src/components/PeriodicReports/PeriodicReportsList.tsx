import { Box, Breadcrumbs, Card, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { ReportType } from '~/api/schema.graphql';
import { Breadcrumb } from '../Breadcrumb';
import { PeriodicReportFragment } from './PeriodicReport.graphql';
import { PeriodicReportsTable } from './PeriodicReportsTable';

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
  const reportTypeName = `${type} Reports`;

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component="main"
        sx={[
          {
            padding: 4,
            maxWidth: 'md',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          },
        ]}
      >
        <Helmet title={`${reportTypeName} - ${pageTitleSuffix}`} />
        <Breadcrumbs
          children={[
            ...breadcrumbs,
            <Breadcrumb to="." key="report">
              {reportTypeName}
            </Breadcrumb>,
          ]}
        />

        <Typography variant="h2" sx={{ my: 3 }}>
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
      </Box>
    </Box>
  );
};
