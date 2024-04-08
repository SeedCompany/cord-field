import { Box } from '@mui/material';
import { boolean, number, select, text } from '@storybook/addon-knobs';
import {
  ProjectStatusList,
  ProjectStepList,
  ProjectTypeList,
  SensitivityList,
} from '../../api/schema';
import { date, dateTime } from '../knobs.stories';
import { ProjectListItemFragment } from './ProjectListItem.graphql';
import { ProjectListItemCard as PIC } from './ProjectListItemCard';

export default { title: 'Components' };

export const ProjectListItemCard = () => {
  const project: ProjectListItemFragment = {
    __typename: 'TranslationProject',
    id: '123',
    createdAt: dateTime('createdAt'),
    type: select('Type', ProjectTypeList, 'Internship'),
    projectStatus: select('status', ProjectStatusList, 'Active'),
    sensitivity: select('sensitivity', SensitivityList, 'High'),
    modifiedAt: dateTime('modifiedAt'),
    pinned: true,
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
