import { action } from '@storybook/addon-actions';
import React from 'react';
import { CreateOrganizationForm as Form } from './CreateOrganizationForm';

export default { title: 'Scenes/Organizations' };

export const CreateOrganizationForm = () => (
  <Form onSubmit={action('onSubmit')} />
);
