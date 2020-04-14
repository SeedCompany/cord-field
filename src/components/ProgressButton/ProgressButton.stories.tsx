import { action } from '@storybook/addon-actions';
import React from 'react';
import { ProgressButton } from '.';

export default { title: 'Buttons.ProgressButton' };

export const Base = () => (
  <ProgressButton
    color="primary"
    variant="contained"
    onClick={action('button click')}
  >
    Hello, I'm a Progress Button
  </ProgressButton>
);

export const DifferentVariant = () => (
  <ProgressButton
    color="primary"
    variant="outlined"
    onClick={action('button click')}
    type="submit"
  >
    Hello, I'm a Progress Button
  </ProgressButton>
);

export const Disabled = () => (
  <ProgressButton
    color="primary"
    variant="outlined"
    onClick={action('button click')}
    disabled
  >
    Hello, I'm a Progress Button
  </ProgressButton>
);

export const ProgressIndicator = () => (
  <ProgressButton
    color="primary"
    variant="outlined"
    onClick={action('button click')}
    progress
  >
    Hello, I'm a Progress Button
  </ProgressButton>
);
