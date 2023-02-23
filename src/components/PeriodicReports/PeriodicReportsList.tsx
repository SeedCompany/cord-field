import { Box, Breadcrumbs, Card, CardProps, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { ReportType } from '~/api/schema.graphql';
import { defaultSx, StyleProps } from '~/common';
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
  sx,
  className,
  TableCardProps,
}: {
  type: ReportType;
  breadcrumbs?: ReactNode[];
  pageTitleSuffix?: string;
  children?: ReactNode;
  reports?: readonly PeriodicReportFragment[];
  onRowClick?: (report: PeriodicReportFragment) => void;
  TableCardProps?: CardProps;
} & StyleProps) => {
  const reportTypeName = `${type === 'Progress' ? 'Quarterly' : type} Reports`;

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
        sx={defaultSx(sx, {
          padding: 4,
          maxWidth: 'md',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        })}
        className={className}
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

        <Card {...TableCardProps}>
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
