import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { sampleSize } from 'lodash';
import { DateTime } from 'luxon';
import React from 'react';
import { RoleList } from '../../api';
import { ProjectMemberCardFragment } from './ProjectMember.generated';
import { ProjectMemberCard as ProjectMemberCardComponent } from './ProjectMemberCard';

export default { title: 'Components' };

const roles = sampleSize(RoleList, 2);

const projectMember: ProjectMemberCardFragment = {
  id: '0',
  createdAt: DateTime.local(),
  user: {
    value: {
      id: '123',
      fullName: 'Julius Cassin',
      avatarLetters: 'JC',
    },
  },
  roles: {
    value: roles,
    canRead: boolean('rolesReadable', true),
  },
};

export const ProjectMemberCard = () => (
  <ProjectMemberCardComponent
    onEdit={action('click')}
    primaryOrganizationName="Seed Company"
    projectMember={boolean('loading', false) ? undefined : projectMember}
  />
);
