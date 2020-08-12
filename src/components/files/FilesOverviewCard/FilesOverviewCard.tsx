import { LibraryBooksOutlined } from '@material-ui/icons';
import React, { FC } from 'react';
import { FieldOverviewCard } from '../../FieldOverviewCard';
import { useNumberFormatter } from '../../Formatters';

export interface BudgetOverviewCardProps {
  className?: string;
  loading?: boolean;
  total: number | undefined;
}

export const FilesOverviewCard: FC<BudgetOverviewCardProps> = ({
  className,
  loading,
  total,
}) => {
  const formatNumber = useNumberFormatter();
  return (
    <FieldOverviewCard
      className={className}
      title="Files"
      viewLabel="View Files"
      data={
        loading
          ? undefined
          : {
              to: 'files',
              value: total ? String(formatNumber(total)) : '∞',
            }
      }
      icon={LibraryBooksOutlined}
    />
  );
};
