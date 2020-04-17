import { action } from '@storybook/addon-actions';
import React from 'react';
import { ErrorButton } from './ErrorButton';

export default { title: 'Components/Buttons/ErrorButton' };

export const Base = () => (
  <ErrorButton onClick={action('button click')}>
    This is an Error Button
  </ErrorButton>
);
