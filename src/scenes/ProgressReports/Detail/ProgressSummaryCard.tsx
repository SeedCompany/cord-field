import {
  Card,
  CardContent,
  Fab,
  Grid,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { Many } from 'lodash';
import React, { ReactNode } from 'react';
import { displayGroupOfVarianceReason } from '~/common';
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
        <Grid item xs={6} sm={3}>
          <Typography
            variant="h2"
            gutterBottom
            color={
              !loading && explanation?.varianceReasons.value?.length === 0
                ? 'textSecondary'
                : 'textPrimary'
            }
          >
            {explanation?.varianceReasons.value ? (
              <>{`${
                explanation.varianceReasons.value.length > 0
                  ? displayGroupOfVarianceReason(
                      explanation.varianceReasons.value
                    )
                  : 'N/A'
              }`}</>
            ) : (
              <>N/A</>
            )}
          </Typography>

          {explanation?.varianceExplanation.value ?? 'No explanation given'}
        </Grid>
        {explanation && (
          <Grid item>
            <Tooltip title="Update variance explanation and reasons">
              <Fab
                color="primary"
                onClick={() => editExplanation('varianceReasons')}
              >
                <Edit />
              </Fab>
            </Tooltip>
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
