import { LibraryBooksOutlined } from '@material-ui/icons';
import React, { FC } from 'react';
import {
  FieldOverviewCard,
  FieldOverviewCardProps,
} from '../../FieldOverviewCard';
import { useNumberFormatter } from '../../Formatters';

export interface BudgetOverviewCardProps extends FieldOverviewCardProps {
  total?: number;
}

export const FilesOverviewCard: FC<BudgetOverviewCardProps> = ({
  redacted,
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
      redacted={!redacted}
      data={{
        to: 'files',
        value: total ? String(formatNumber(total)) : '∞',
      }}
      icon={LibraryBooksOutlined}
    />
  );
};
