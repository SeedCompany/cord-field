import { Box } from '@material-ui/core';
import { AccountBalance } from '@material-ui/icons';
import { date, text } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import React from 'react';
import { FieldOverviewCard as FieldOverviewCardComponent } from '.';
import { HugeIcon } from '../Icons';
import { AddCurrentPath } from '../Routing/decorators.stories';

export default {
  title: 'Components',
  decorators: [AddCurrentPath],
};

export const FieldOverviewCard = () => (
  <Box display="flex">
    <FieldOverviewCardComponent
      title={text('title', 'Project Budget')}
      to={text('to', '/foo')}
      value={text('value', '$45,978')}
      icon={<HugeIcon icon={AccountBalance} />}
      updatedAt={DateTime.fromMillis(date('updatedAt'))}
      viewLabel={text('viewLabel', 'Budget History')}
    />
  </Box>
);
