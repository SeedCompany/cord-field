import { LibraryBooksOutlined } from '@material-ui/icons';
import React, { FC } from 'react';
import { FieldOverviewCard } from '../../FieldOverviewCard';
import { useNumberFormatter } from '../../Formatters';

export interface BudgetOverviewCardProps {
  canReadFiles: boolean;
  className?: string;
  loading?: boolean;
  total?: number;
}

export const FilesOverviewCard: FC<BudgetOverviewCardProps> = ({
  canReadFiles,
  className,
  loading,
  total,
}) => {
  const formatNumber = useNumberFormatter();
  return (
    <FieldOverviewCard
      className={className}
      title="Files"
      redactedText="You do not have permission to view files for this project"
      viewLabel="View Files"
      loading={loading}
      redacted={!canReadFiles}
      data={{
        to: 'files',
        value: total ? String(formatNumber(total)) : '∞',
      }}
      icon={LibraryBooksOutlined}
    />
  );
};
