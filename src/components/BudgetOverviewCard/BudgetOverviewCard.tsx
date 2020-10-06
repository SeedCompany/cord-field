import { AccountBalance } from '@material-ui/icons';
import * as React from 'react';
import { FC } from 'react';
import {
  FieldOverviewCard,
  FieldOverviewCardProps,
} from '../FieldOverviewCard';
import { useCurrencyFormatter } from '../Formatters/useCurrencyFormatter';
import { BudgetOverviewFragment } from './BudgetOverview.generated';

export interface BudgetOverviewCardProps extends FieldOverviewCardProps {
  budget?: BudgetOverviewFragment | null;
}

export const BudgetOverviewCard: FC<BudgetOverviewCardProps> = ({
  className,
  budget,
  loading,
}) => {
  const formatCurrency = useCurrencyFormatter();

  return (
    <FieldOverviewCard
      className={className}
      title="Field Budget"
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
