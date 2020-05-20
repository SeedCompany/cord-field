import { Box } from '@material-ui/core';
import { AccountBalance } from '@material-ui/icons';
import { date, text } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import React from 'react';
import { HugeIcon } from '../Icons';
import { AddCurrentPath } from '../Routing/decorators.stories';
import { FieldOverviewCard } from './FieldOverviewCard';

export default {
  title: 'Components/Field Overview Card',
  decorators: [AddCurrentPath],
};

export const WithData = () => (
  <Box display="flex">
    <FieldOverviewCard
      data={{
        title: text('title', 'Project Budget'),
        to: text('to', '/foo'),
        value: text('value', '$45,978'),
        icon: <HugeIcon icon={AccountBalance} />,
        updatedAt: DateTime.fromMillis(date('updatedAt')),
        viewLabel: text('viewLabel', 'Budget History'),
      }}
    />
  </Box>
);

export const Loading = () => (
  <Box display="flex">
    <FieldOverviewCard />
  </Box>
);
