import { ChangeHistory } from '@material-ui/icons';
import * as React from 'react';
import { FC } from 'react';
import { FieldOverviewCard } from '../FieldOverviewCard';
import { useNumberFormatter } from '../Formatters';
import { PlanChangeListFragment } from './PlanChangesSummary.generated';

export interface PlanChangesSummaryProps {
  planChanges?: PlanChangeListFragment;
}

export const PlanChangesSummary: FC<PlanChangesSummaryProps> = ({
  planChanges,
}) => {
  const formatNumber = useNumberFormatter();
  return (
    <FieldOverviewCard
      title="Plan Changes"
      viewLabel="View Changes"
      loading={!planChanges}
      data={
        planChanges
          ? {
              to: 'changes',
              value: formatNumber(planChanges.total),
            }
          : undefined
      }
      icon={ChangeHistory}
    />
  );
};
