import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Except } from 'type-fest';
import { handleFormError } from '../../../api';
import { useResetPasswordMutation } from './ResetPassword.generated';
import {
  ResetPasswordFormProps as Props,
  ResetPasswordForm,
} from './ResetPasswordForm';
import { ResetPasswordSuccess } from './ResetPasswordSuccess';

export const ResetPassword = (props: Except<Props, 'onSubmit'>) => {
  const [resetPassword] = useResetPasswordMutation();
  const { token } = useParams() as { token: string };
  const [success, setSuccess] = useState(false);

  const submit: Props['onSubmit'] = async ({ password }) => {
    try {
      await resetPassword({
        variables: {
          input: {
            token,
            password,
          },
        },
      });
      setSuccess(true);
    } catch (e) {
      return await handleFormError(e, {
        TokenExpired: `Password reset request has expired. Try forgot password again.`,
        Default: `Something went wrong. Try forgot password again.`,
      });
    }
  };

  return success ? (
    <ResetPasswordSuccess className={props.className} />
  ) : (
    <ResetPasswordForm {...props} onSubmit={submit} />
  );
};
