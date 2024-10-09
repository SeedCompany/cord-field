import { Card, CardActions, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { StyleProps } from '~/common';
import { ProgressSummaryFragment } from './ProgressReportDetail.graphql';
import { ProgressSummaryStats } from './ProgressSummaryStats';
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
        isForDashboardTable={false}
        sx={{ py: 2 }}
      />

      {varianceExplanation && (
        <VarianceExplanation data={varianceExplanation} />
      )}
    </CardContent>
    {actions && <CardActions children={actions} />}
  </Card>
);
