import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';
import { ErrorButton as EB } from './ErrorButton';

export default { title: 'Components/Buttons' };

export const ErrorButton = () => (
  <EB
    variant={select('Variant', ['contained', 'text', 'outlined'], 'contained')}
    size={select('Size', ['small', 'medium', 'large'], 'medium')}
    disabled={boolean('Disabled', false)}
    fullWidth={boolean('Full Width', false)}
    onClick={action('click')}
  >
    {text('Label', `Delete`)}
  </EB>
);
