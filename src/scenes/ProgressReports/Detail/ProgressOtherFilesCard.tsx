import { LibraryBooksOutlined } from '@material-ui/icons';
import React, { FC } from 'react';
import {
  FieldOverviewCard,
  FieldOverviewCardProps,
} from '~/components/FieldOverviewCard';
import { useNumberFormatter } from '~/components/Formatters';

export interface OtherFilesCardProps extends FieldOverviewCardProps {
  total?: number;
}

export const OtherFilesOverviewCard: FC<OtherFilesCardProps> = ({
  redacted,
  className,
  loading,
  total,
}) => {
  const formatNumber = useNumberFormatter();
  return (
    <FieldOverviewCard
      className={className}
      title="Other Files"
      redactedText="You do not have permission to view files for this report"
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
