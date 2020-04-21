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
        alert('Recovery email sent.');
      } else {
        alert('Email not found');
      }
    } catch (e) {
      alert('Could not make correct query');
      console.log(e);
    }
  };

  return <ForgotPasswordForm {...props} onSubmit={submit} />;
};
