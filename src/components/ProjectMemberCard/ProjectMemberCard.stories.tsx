import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import React from 'react';
import { Role } from '../../api';
import { ProjectMemberFragment } from './ProjectMember.generated';
import { ProjectMemberCard as ProjectMemberCardComponent } from './ProjectMemberCard';

export default { title: 'Components' };

const roles: Role[] = ['Consultant', 'Development'];

const projectMember: ProjectMemberFragment = {
  id: '0',
  createdAt: DateTime.local(),
  user: {
    value: {
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
