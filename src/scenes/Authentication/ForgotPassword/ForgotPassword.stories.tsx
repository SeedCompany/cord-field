import { action } from '@storybook/addon-actions';
import React from 'react';
import { ForgotPasswordForm as Form } from './ForgotPasswordForm';

export default { title: 'Scenes/Authentication/ForgotPassword' };

export const ForgotPasswordForm = () => <Form onSubmit={action('onSubmit')} />;
