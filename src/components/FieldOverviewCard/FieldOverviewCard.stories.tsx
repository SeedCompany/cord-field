import { Box } from '@material-ui/core';
import { AccountBalance } from '@material-ui/icons';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { dateTime } from '../knobs.stories';
import { AddCurrentPath } from '../Routing/decorators.stories';
import { FieldOverviewCard as Card } from './FieldOverviewCard';

export default {
  title: 'Components',
  decorators: [AddCurrentPath],
};

export const FieldOverviewCard = () => (
  <Box display="flex" width={400}>
    <Card
      title={text('title', 'Project Budget')}
      icon={AccountBalance}
      viewLabel={text('viewLabel', 'Budget History')}
      data={
        boolean('loading', false)
          ? undefined
          : {
              to: text('to', '/foo'),
              value: text('value', '$45,978'),
              updatedAt: dateTime('updatedAt'),
            }
      }
      emptyValue={text('Empty placeholder', 'N/A') || undefined}
      onClick={action('action area click')}
      onButtonClick={action('button click')}
    />
  </Box>
);
