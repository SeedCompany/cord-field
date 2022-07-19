import { Box } from '@material-ui/core';
import { boolean, number } from '@storybook/addon-knobs';
import { dateTime } from '../knobs.stories';
import { BudgetOverviewFragment } from './BudgetOverview.graphql';
import { BudgetOverviewCard as BOC } from './BudgetOverviewCard';

export default { title: 'components' };

export const BudgetOverviewCard = () => {
  const BudgetItem: BudgetOverviewFragment = {
    __typename: 'Budget',
    id: '123123123',
    createdAt: dateTime('updatedAt'),
    total: number('Total', 123123),
  };
  return (
    <Box display="flex" width={400}>
      <BOC budget={boolean('Loading', false) ? undefined : BudgetItem} />
    </Box>
  );
};
