import { action } from '@storybook/addon-actions';
import React from 'react';
import { LoginForm as Form } from './LoginForm';

export default { title: 'Scenes/Authentication/Login' };

export const LoginForm = () => <Form onSubmit={action('onSubmit')} />;
