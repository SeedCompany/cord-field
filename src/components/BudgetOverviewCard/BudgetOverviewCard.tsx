import { AccountBalance } from '@material-ui/icons';
import * as React from 'react';
import { FC } from 'react';
import { FieldOverviewCard } from '../FieldOverviewCard';
import { useCurrencyFormatter } from '../Formatters/useCurrencyFormatter';
import { BudgetOverviewFragment } from './BudgetOverview.generated';

export interface BudgetOverviewCardProps {
  budget?: BudgetOverviewFragment | null;
  className?: string;
}

export const BudgetOverviewCard: FC<BudgetOverviewCardProps> = ({
  className,
  budget,
}) => {
  const formatCurrency = useCurrencyFormatter();

  return (
    <FieldOverviewCard
      className={className}
      title="Field Budget"
      viewLabel="Budget Details"
      data={
        budget
          ? {
              updatedAt: budget.createdAt,
              value: formatCurrency(budget.total),
              to: `budget`,
            }
          : undefined
      }
      icon={AccountBalance}
    />
  );
};
