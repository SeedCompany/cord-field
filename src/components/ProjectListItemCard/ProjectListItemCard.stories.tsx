import { select, text } from '@storybook/addon-knobs';
import React from 'react';
import { ProjectListItemCard as PIC } from './ProjectListItemCard';

export default { title: 'Components/ProjectListItemCard' };

export const ProjectListItemCard = () => (
  <PIC
    id={text('Id', '123')}
    createdAt="12/12/20"
    type={select('Type', ['Translation', 'Internship'], 'Internship')}
    status={select(
      'status',
      ['InDevelopment', 'Pending', 'Active', 'Stopped', 'Finished'],
      'Active'
    )}
    sensitivity={select('sensitivity', ['High', 'Low', 'Medium'], 'High')}
    modifiedAt="12/12/20"
    deptId={{ value: '123' }}
    estimatedSubmission={{ value: text('Id', '12/12/20') }}
    step={{
      value: select(
        'ProjectStep',
        ['Active', 'Rejected', 'Suspended'],
        'Active'
      ),
    }}
    name={{ value: text('Id', 'project') }}
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
);
