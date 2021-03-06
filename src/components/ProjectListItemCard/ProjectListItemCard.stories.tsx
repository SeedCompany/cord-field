import { Box } from '@material-ui/core';
import { boolean, number, select, text } from '@storybook/addon-knobs';
import React from 'react';
import {
  ProjectStatusList,
  ProjectStepList,
  ProjectTypeList,
  SensitivityList,
} from '../../api/enumLists';
import { date, dateTime } from '../knobs.stories';
import { ProjectListItemFragment } from './ProjectListItem.generated';
import { ProjectListItemCard as PIC } from './ProjectListItemCard';

export default { title: 'Components' };

export const ProjectListItemCard = () => {
  const project: ProjectListItemFragment = {
    id: '123',
    createdAt: dateTime('createdAt'),
    type: select('Type', ProjectTypeList, 'Internship'),
    status: select('status', ProjectStatusList, 'Active'),
    sensitivity: select('sensitivity', SensitivityList, 'High'),
    modifiedAt: dateTime('modifiedAt'),
    departmentId: { value: text('departmentId', '1234567') },
    estimatedSubmission: {
      value: date('estimatedSubmission'),
    },
    step: {
      value: select('ProjectStep', ProjectStepList, 'Active'),
    },
    name: { value: text('name', 'Project A') },
    primaryLocation: {
      value: {
        __typename: 'Location',
        id: '123',
        name: {
          canRead: true,
          canEdit: true,
          value: text('location', 'Texas'),
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
