import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Except } from 'type-fest';
import { handleFormError } from '../../../api';
import { ResetPasswordDocument } from './ResetPassword.generated';
import {
  ResetPasswordFormProps as Props,
  ResetPasswordForm,
} from './ResetPasswordForm';
import { ResetPasswordSuccess } from './ResetPasswordSuccess';

export const ResetPassword = (props: Except<Props, 'onSubmit'>) => {
  const [resetPassword] = useMutation(ResetPasswordDocument);
  const { token } = useParams() as { token: string };
  const [success, setSuccess] = useState(false);

  const submit: Props['onSubmit'] = async ({ password }, form) => {
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
      return await handleFormError(e, form, {
        TokenExpired: `Password reset request has expired. Try forgot password again.`,
        Default: `Something went wrong. Try forgot password again.`,
      });
    }
  };

  const out = success ? (
    <ResetPasswordSuccess className={props.className} />
  ) : (
    <ResetPasswordForm {...props} onSubmit={submit} />
  );
  return (
    <>
      <Helmet title="Reset Password" />
      {out}
    </>
  );
};
