import {
  Card,
  CardContent,
  Fab,
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { Many } from 'lodash';
import { relative } from 'path';
import React, { ReactNode } from 'react';
import { ProgressVarianceReasonLabels } from '~/api';
import { displayGroupOfVarianceReason, labelsFrom } from '~/common';
import { useDialog } from '~/components/Dialog';
import {
  EditableExplanationField,
  ExplanationForm,
} from '../ExplanationForm/ExplanationForm';
import { ExplanationOfVarianceFormFragment } from '../ExplanationForm/ExplanationForm.graphql';
import { ProgressSummaryFragment } from './ProgressReportDetail.graphql';


interface ProgressSummaryCardProps {
  summary: ProgressSummaryFragment | null;
  loading: boolean;
}

export const ProgressSummaryCard = ({
  summary,
  loading,
}: ProgressSummaryCardProps) => {
  return (
    <Grid component={Card} container>
      <Grid
        component={CardContent}
        alignContent="center"
        container
        spacing={3}
        justify="space-evenly"
        xs={12}
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
};

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
