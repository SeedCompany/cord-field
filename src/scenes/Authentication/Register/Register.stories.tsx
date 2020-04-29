import { action } from '@storybook/addon-actions';
import React from 'react';
import { RegisterForm as Form } from './RegisterForm';

export default { title: 'Scenes/Authentication/Register' };

export const RegisterForm = () => <Form onSubmit={action('onSubmit')} />;
