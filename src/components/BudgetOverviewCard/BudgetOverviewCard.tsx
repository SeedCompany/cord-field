import { AccountBalance, Warning } from '@mui/icons-material';
import { Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { ProjectStatus } from '~/api/schema.graphql';
import {
  FieldOverviewCard,
  FieldOverviewCardProps,
} from '../FieldOverviewCard';
import { useCurrencyFormatter } from '../Formatters/useCurrencyFormatter';
import { BudgetOverviewFragment } from './BudgetOverview.graphql';

export interface BudgetOverviewCardProps extends FieldOverviewCardProps {
  budget?: BudgetOverviewFragment | null;
  status?: ProjectStatus;
}

export const BudgetOverviewCard = ({
  className,
  budget,
  loading,
  status,
}: BudgetOverviewCardProps) => {
  const formatCurrency = useCurrencyFormatter();

  return (
    <FieldOverviewCard
      className={className}
      title={
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h4">
            {loading ? <Skeleton width="80%" /> : 'Field Budget'}
          </Typography>
          {budget?.budgetSummary.preApprovedExceeded &&
            status === 'InDevelopment' && (
              <Tooltip title="Pre-approved Item Exceeded">
                <Warning color="error" />
              </Tooltip>
            )}
        </Box>
      }
      viewLabel="Budget Details"
      loading={loading}
      data={{
        updatedAt: budget?.createdAt,
        value: budget ? formatCurrency(budget.total) : 'Not Available',
        to: `budget`,
      }}
      icon={AccountBalance}
    />
  );
};
