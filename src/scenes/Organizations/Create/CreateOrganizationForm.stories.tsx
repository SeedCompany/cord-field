import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import { CreateOrganizationForm as Form } from './CreateOrganizationForm';

export default { title: 'Scenes/Organizations' };

export const CreateOrganizationForm = () => {
  return (
    <Form
      onSubmit={action('onSubmit')}
      open={boolean('Open', false)}
      onClose={action('click')}
    />
  );
};
