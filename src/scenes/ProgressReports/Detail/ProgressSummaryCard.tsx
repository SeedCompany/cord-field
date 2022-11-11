import { Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { StyleProps } from '~/common';
import { ProgressSummaryFragment } from './ProgressReportDetail.graphql';

interface ProgressSummaryCardProps extends StyleProps {
  summary: ProgressSummaryFragment | null;
  loading: boolean;
}

export const ProgressSummaryCard = ({
  summary,
  loading,
  sx,
}: ProgressSummaryCardProps) => (
  <Grid component={Card} container sx={sx}>
    <Grid
      component={CardContent}
      alignContent="center"
      container
      spacing={3}
      justifyContent="space-evenly"
    >
      <Value loading={loading} value={summary?.planned}>
        Planned <br />
        Progress
      </Value>
      <Value loading={loading} value={summary?.actual}>
        Actual <br />
        Progress
      </Value>
      <Value loading={loading} value={summary?.variance}>
        Variance
      </Value>
    </Grid>
  </Grid>
);

const Value = ({
  loading,
  value,
  children,
}: {
  loading: boolean;
  value?: number;
  children: ReactNode;
}) => (
  <Grid item>
    <Typography
      variant="h2"
      gutterBottom
      color={!loading && !value ? 'textSecondary' : 'textPrimary'}
    >
      {loading ? (
        <Skeleton width="4ch" />
      ) : value ? (
        `${(value * 100).toFixed(1)}%`
      ) : (
        'None'
      )}
    </Typography>
    <Typography variant="body2" align="right">
      {loading ? (
        <Skeleton width={50} style={{ marginLeft: 'auto' }} />
      ) : (
        children
      )}
    </Typography>
  </Grid>
);
