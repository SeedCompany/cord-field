import { Box } from '@material-ui/core';
import { date, select, text } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import React from 'react';
import { ProjectListItemCard as PIC } from './ProjectListItemCard';

export default { title: 'Components' };

export const ProjectListItemCard = () => (
  <Box display="flex">
    <PIC
      id="123"
      createdAt="12/12/20"
      type={select('Type', ['Translation', 'Internship'], 'Internship')}
      status={select(
        'status',
        ['InDevelopment', 'Pending', 'Active', 'Stopped', 'Finished'],
        'Active'
      )}
      sensitivity={select('sensitivity', ['High', 'Low', 'Medium'], 'High')}
      modifiedAt="12/12/20"
      deptId={{ value: text('deptId', '1234567') }}
      estimatedSubmission={{
        value: DateTime.fromMillis(date('estimatedSubmission')).toLocaleString(
          DateTime.DATE_SHORT
        ),
      }}
      step={{
        value: select(
          'ProjectStep',
          ['Active', 'Rejected', 'Suspended'],
          'Active'
        ),
      }}
      name={{ value: text('name', 'Project A') }}
      location={{
        value: {
          __typename: 'Country',
          name: { value: 'Texas' },
          region: {
            value: {
              name: {
                value: 'United States',
              },
              zone: {
                value: {
                  name: {
                    value: 'Americas',
                  },
                },
              },
            },
          },
        },
      }}
      // engagements={{ total: number('Engagements', 123) }}
    />
  </Box>
);
