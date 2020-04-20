import React from 'react';
import { Except } from 'type-fest';
import {
  ForgotPasswordForm,
  ForgotPasswordFormProps as Props,
} from './ForgotPasswordForm';

export const ForgotPassword = (props: Except<Props, 'onSubmit'>) => {
  const submit: Props['onSubmit'] = async (input) => {
    try {
      console.log(input);
    } catch (e) {
      alert('Email not found');
      console.log(e);
    }
  };

  return <ForgotPasswordForm {...props} onSubmit={submit} />;
};
