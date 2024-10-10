import {
  Card,
  CardActions,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';
import { StyleProps } from '~/common';
import { ProgressSummaryFragment } from './ProgressReportDetail.graphql';
import { VarianceExplanation } from './VarianceExplanation/VarianceExplanation';
import { VarianceExplanationFragment } from './VarianceExplanation/VarianceExplanation.graphql';

interface ProgressSummaryCardProps extends StyleProps {
  summary: ProgressSummaryFragment | null;
  varianceExplanation?: VarianceExplanationFragment;
  loading: boolean;
  actions?: ReactNode;
}

export const ProgressSummaryCard = ({
  summary,
  varianceExplanation,
  loading,
  actions,
  ...rest
}: ProgressSummaryCardProps) => (
  <Card {...rest}>
    <CardContent>
      <Typography variant="h3">Cumulative Progress</Typography>

      <ProgressSummaryStats
        loading={loading}
        summary={summary}
        sx={{ py: 2 }}
      />

      {varianceExplanation && (
        <VarianceExplanation data={varianceExplanation} />
      )}
    </CardContent>
    {actions && <CardActions children={actions} />}
  </Card>
);

const ProgressSummaryStats = ({
  loading,
  summary,
  ...rest
}: {
  loading: boolean;
  summary: ProgressSummaryFragment | null;
} & StyleProps) => (
  <Grid
    alignContent="center"
    container
    spacing={3}
    justifyContent="space-evenly"
    {...rest}
  >
    <Value loading={loading} value={summary?.planned}>
      Planned
    </Value>
    <Value loading={loading} value={summary?.actual}>
      Actual
    </Value>
    <Value loading={loading} value={summary?.variance}>
      Variance
    </Value>
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
