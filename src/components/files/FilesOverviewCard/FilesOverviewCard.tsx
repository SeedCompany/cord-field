import { LibraryBooksOutlined } from '@mui/icons-material';
import {
  FieldOverviewCard,
  FieldOverviewCardProps,
} from '../../FieldOverviewCard';
import { useNumberFormatter } from '../../Formatters';

export interface FilesOverviewCardProps extends FieldOverviewCardProps {
  total?: number;
}

export const FilesOverviewCard = ({
  total,
  ...rest
}: FilesOverviewCardProps) => {
  const formatNumber = useNumberFormatter();
  return (
    <FieldOverviewCard
      title="Files"
      redactedText="You do not have permission to view files for this project"
      viewLabel="View Files"
      data={{
        to: 'files',
        value: total != null ? String(formatNumber(total)) : '∞',
      }}
      icon={LibraryBooksOutlined}
      {...rest}
    />
  );
};
