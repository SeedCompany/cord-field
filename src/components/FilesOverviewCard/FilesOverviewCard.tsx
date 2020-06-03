import { LibraryBooksOutlined } from '@material-ui/icons';
import * as React from 'react';
import { FC } from 'react';
import { FieldOverviewCard } from '../FieldOverviewCard';

export interface BudgetOverviewCardProps {
  className?: string;
}

export const FilesOverviewCard: FC<BudgetOverviewCardProps> = ({
  className,
}) => {
  return (
    <FieldOverviewCard
      className={className}
      title=""
      viewLabel="View Files"
      data={{
        to: 'files',
        value: 'Files',
      }}
      icon={LibraryBooksOutlined}
    />
  );
};
