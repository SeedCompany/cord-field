import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { ReactNode } from 'react';
import { ProgressSummaryFragment } from './ProgressReportDetail.graphql';

interface ProgressSummaryCardProps {
  summary: ProgressSummaryFragment | null;
  loading: boolean;
}

export const ProgressSummaryCard = ({
  summary,
  loading,
}: ProgressSummaryCardProps) => (
  <Grid component={Card} container>
    <Grid
      component={CardContent}
      alignContent="center"
      container
      spacing={3}
      justify="space-evenly"
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
