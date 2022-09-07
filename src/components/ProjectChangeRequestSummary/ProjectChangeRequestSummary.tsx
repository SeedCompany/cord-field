import { ChangeHistory } from '@mui/icons-material';
import { FieldOverviewCard } from '../FieldOverviewCard';
import { useNumberFormatter } from '../Formatters';
import { ProjectChangeRequestSummaryFragment } from './ProjectChangeRequestSummary.graphql';

export interface PlanChangesSummaryProps {
  data?: ProjectChangeRequestSummaryFragment;
}

export const ProjectChangeRequestSummary = ({
  data,
}: PlanChangesSummaryProps) => {
  const formatNumber = useNumberFormatter();
  return (
    <FieldOverviewCard
      title="Change Requests"
      viewLabel="View Requests"
      loading={!data}
      data={
        data
          ? {
              to: 'change-requests',
              value: formatNumber(data.total),
            }
          : undefined
      }
      icon={ChangeHistory}
    />
  );
};
