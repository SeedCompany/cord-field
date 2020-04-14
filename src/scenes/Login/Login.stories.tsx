import { action } from '@storybook/addon-actions';
import React from 'react';
import { MockApp } from '../../App';
import { LoginForm } from './LoginForm';

export default { title: 'Scenes.Login' };

export const _LoginForm = () => (
  <MockApp>
    <LoginForm onSubmit={action('onSubmit')} />
  </MockApp>
);
