import { Box } from '@material-ui/core';
import { boolean, number, select, text } from '@storybook/addon-knobs';
import React from 'react';
import { date, dateTime } from '../knobs.stories';
import { ProjectListItemFragment } from './ProjectListItem.generated';
import { ProjectListItemCard as PIC } from './ProjectListItemCard';

export default { title: 'Components' };

export const ProjectListItemCard = () => {
  const project: ProjectListItemFragment = {
    id: '123',
    createdAt: dateTime('createdAt'),
    type: select('Type', ['Translation', 'Internship'], 'Internship'),
    status: select(
      'status',
      ['InDevelopment', 'Pending', 'Active', 'Stopped', 'Finished'],
      'Active'
    ),
    sensitivity: select('sensitivity', ['High', 'Low', 'Medium'], 'High'),
    modifiedAt: dateTime('modifiedAt'),
    departmentId: { value: text('departmentId', '1234567') },
    estimatedSubmission: {
      value: date('estimatedSubmission'),
    },
    step: {
      value: select(
        'ProjectStep',
        ['Active', 'Rejected', 'Suspended'],
        'Active'
      ),
    },
    name: { value: text('name', 'Project A') },
    location: {
      value: {
        __typename: 'Country',
        id: '123',
        name: { value: text('location', 'Texas') },
        region: {
          value: {
            id: '123',
            name: {
              value: text('region', 'United States'),
            },
            zone: {
              value: {
                name: {
                  value: text('zone', 'Americas'),
                },
              },
            },
          },
        },
      },
    },
    engagements: { total: number('Engagements', 123) },
  };
  return (
    <Box display="flex">
      <PIC project={boolean('loading', false) ? undefined : project} />
    </Box>
  );
};
