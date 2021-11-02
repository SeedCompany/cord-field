import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { ProgressSummaryFragment } from './ProgressReportDetail.generated';

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'right',
    flex: '1',
  },
}));

const Value = ({ loading, value }: { loading: boolean; value?: number }) => {
  return (
    <Typography variant="h2" gutterBottom>
      {loading ? (
        <Skeleton width={80} />
      ) : value ? (
        `${(value * 100).toFixed(1)}%`
      ) : (
        'None'
      )}
    </Typography>
  );
};

interface CumulativeSummaryCardProps {
  summary: ProgressSummaryFragment | null;
  loading: boolean;
}

export const CumulativeSummaryCard: FC<CumulativeSummaryCardProps> = ({
  summary,
  loading,
}) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container justify="space-around">
          <Grid item>
            <Value loading={loading} value={summary?.planned} />
            <Typography variant="body2">
              Planned <br />
              Progress
            </Typography>
          </Grid>
          <Grid item>
            <Value loading={loading} value={summary?.actual} />
            <Typography variant="body2">
              Actual <br />
              Progress
            </Typography>
          </Grid>
          <Grid item>
            <Value loading={loading} value={summary?.variance} />
            <Typography variant="body2">Variance</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
