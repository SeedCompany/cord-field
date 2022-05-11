import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Many } from 'lodash';
import React, { ReactNode } from 'react';
import { DataButton } from '~/components/DataButton';
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
  explanation: ExplanationOfVarianceFormFragment | null;
}

export const ProgressSummaryCard = ({
  summary,
  loading,
  explanation,
}: ProgressSummaryCardProps) => {
  const [editExplanationState, editExplanation] =
    useDialog<Many<EditableExplanationField>>();
  return (
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
        {explanation && (
          <Grid item>
            <DataButton
              secured={explanation.varianceReasons}
              redacted="You do not have permission to view the variance explanation"
              onClick={() => editExplanation('varianceReasons')}
              children={
                explanation.varianceReasons.value &&
                `Variance: ${explanation.varianceReasons.value}`
              }
              empty={'Enter Explanation of Variance'}
            />
            <ExplanationForm
              progressReport={explanation}
              {...editExplanationState}
            />
          </Grid>
        )}
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
