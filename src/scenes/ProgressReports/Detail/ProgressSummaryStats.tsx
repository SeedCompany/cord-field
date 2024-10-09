import { Grid, Skeleton, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { StyleProps } from '~/common';
import { ProgressSummaryFragment } from './ProgressReportDetail.graphql';

export const ProgressSummaryStats = ({
  loading,
  summary,
  isForDashboardTable,
  ...rest
}: {
  loading: boolean;
  summary: ProgressSummaryFragment | null;
  isForDashboardTable?: boolean;
} & StyleProps) => {
  const typographyProps = isForDashboardTable
    ? { variant: 'body2' }
    : { variant: 'h2', gutterBottom: true };
  const childTypographyProps = isForDashboardTable
    ? { variant: 'body2', align: 'left' }
    : { variant: 'body2', align: 'right' };
  const skeletonProps = isForDashboardTable ? undefined : { width: '4ch' };

  const getColor = (value?: number) =>
    !loading && !value ? 'textSecondary' : 'textPrimary';

  const renderValue = (value: number | undefined, label: string) => (
    <Value
      loading={loading}
      value={value}
      typographyProps={{ ...typographyProps, color: getColor(value) }}
      skeletonProps={skeletonProps}
      childTypographyProps={childTypographyProps}
    >
      {label}
    </Value>
  );

  return (
    <Grid
      alignContent="center"
      container
      spacing={3}
      justifyContent={isForDashboardTable ? 'left' : 'space-evenly'}
      {...rest}
    >
      {renderValue(summary?.planned, 'Planned')}
      {renderValue(summary?.actual, 'Actual')}
      {renderValue(summary?.variance, 'Variance')}
    </Grid>
  );
};

const Value = ({
  loading,
  value,
  children,
  typographyProps,
  skeletonProps,
  childTypographyProps,
}: {
  loading: boolean;
  value?: number;
  children: ReactNode;
  typographyProps?: any;
  skeletonProps?: any;
  childTypographyProps?: any;
}) => (
  <Grid item>
    <Typography {...typographyProps}>
      {loading ? (
        <Skeleton {...skeletonProps} />
      ) : value ? (
        `${(value * 100).toFixed(1)}%`
      ) : (
        'None'
      )}
    </Typography>
    <Typography {...childTypographyProps}>
      {loading ? (
        <Skeleton width={50} style={{ marginLeft: 'auto' }} />
      ) : (
        children
      )}
    </Typography>
  </Grid>
);
