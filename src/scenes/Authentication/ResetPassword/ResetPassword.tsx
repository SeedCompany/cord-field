import React from 'react';
import { Except } from 'type-fest';
import { StringParam, useQueryParam } from 'use-query-params';
import { useResetPasswordMutation } from '../../../api';
import {
  ResetPasswordFormProps as Props,
  ResetPasswordForm,
} from './ResetPasswordForm';

export const ResetPassword = (props: Except<Props, 'onSubmit'>) => {
  const [resetPasswordToken] = useQueryParam('token', StringParam);
  const [resetPassword] = useResetPasswordMutation();

  const submit: Props['onSubmit'] = async (input) => {
    try {
      input.token = resetPasswordToken as string;
      const res = await resetPassword({
        variables: { input },
      });

      if (res?.resetPassword) {
        alert('Successfully set password');
      } else {
        alert('Could not update new password');
      }
    } catch (e) {
      alert('Could not make correct query');
      console.log(e);
    }
  };

  return <ResetPasswordForm {...props} onSubmit={submit} />;
};
