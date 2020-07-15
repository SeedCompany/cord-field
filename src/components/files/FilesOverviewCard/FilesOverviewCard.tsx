import { LibraryBooksOutlined } from '@material-ui/icons';
import * as React from 'react';
import { FC } from 'react';
import { FieldOverviewCard } from '../../FieldOverviewCard';

export interface BudgetOverviewCardProps {
  className?: string;
  loading?: boolean;
}

export const FilesOverviewCard: FC<BudgetOverviewCardProps> = ({
  className,
  loading,
}) => {
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
              value: '∞',
            }
      }
      icon={LibraryBooksOutlined}
    />
  );
};
