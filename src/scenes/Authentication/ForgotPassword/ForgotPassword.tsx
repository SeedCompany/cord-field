import React from 'react';
import { Except } from 'type-fest';
import { useForgotPasswordMutation } from '../../../api';
import {
  ForgotPasswordForm,
  ForgotPasswordFormProps as Props,
} from './ForgotPasswordForm';

export const ForgotPassword = (props: Except<Props, 'onSubmit'>) => {
  const [forgotPassword] = useForgotPasswordMutation();
  const submit: Props['onSubmit'] = async (input) => {
    try {
      const res = await forgotPassword({
        variables: { email: input.email },
      });
      if (res?.forgotPassword) {
        alert('Email for forgot password has been sent.');
      } else {
        alert('Error');
      }
    } catch (e) {
      alert('Email not found');
      console.log(e);
    }
  };

  return <ForgotPasswordForm {...props} onSubmit={submit} />;
};
