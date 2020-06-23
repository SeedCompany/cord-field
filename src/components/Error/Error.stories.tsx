import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';
import React from 'react';
import { Error as ErrorComponent } from './Error';

export default { title: 'Components/Error' };

export const Error = () => (
  <ErrorComponent
    navigateBack={action('go back')}
    variant={select('Error Type', ['Error', '404'], 'Error')}
  />
);
