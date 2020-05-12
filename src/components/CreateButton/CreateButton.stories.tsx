import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';
import { CreateButton as CB } from './CreateButton';

export default { title: 'Components/Buttons' };

export const CreateButton = () => (
  <CB
    variant={select('Variant', ['contained', 'text', 'outlined'], 'contained')}
    size={select('Size', ['small', 'medium', 'large'], 'medium')}
    disabled={boolean('Disabled', false)}
    fullWidth={boolean('Full Width', false)}
    onClick={action('click')}
  >
    {text('Label', `Create`)}
  </CB>
);
