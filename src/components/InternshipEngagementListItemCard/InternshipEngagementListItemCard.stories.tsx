import { text } from '@storybook/addon-knobs';
import React from 'react';
import { EngagementStatus } from '../../api';
import { date } from '../knobs.stories';
import { InternshipEngagementListItemCard as Card } from './InternshipEngagementListItemCard';

export default { title: 'Components' };

export const InternshipEngagementListItemCard = () => (
  <Card
    id="123123"
    projectId="123123"
    status={{
      value: text('status', 'InDevelopment') as EngagementStatus,
      canRead: true,
    }}
    position={{
      value: 'LeadershipDevelopment',
    }}
    countryOfOrigin={
      {
        value: {
          id: 'us',
          name: {
            value: text('countryOfOrigin', 'United States'),
          },
        },
      } as any
    }
    dateRange={{ value: { end: date('endDate') } }}
    initialEndDate={{
      value: date('initialEndDate'),
    }}
    completeDate={{
      value: date('completeDate'),
    }}
    intern={{
      value: {
        id: '2134',
        fullName: text('fullName', 'John Doe'),
      },
    }}
  />
);
