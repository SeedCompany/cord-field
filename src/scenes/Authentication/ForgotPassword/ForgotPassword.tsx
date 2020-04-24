import React, { useState } from 'react';
import { Except } from 'type-fest';
import { handleFormError, useForgotPasswordMutation } from '../../../api';
import {
  ForgotPasswordForm,
  ForgotPasswordFormProps as Props,
} from './ForgotPasswordForm';
import { ForgotPasswordSuccess } from './ForgotPasswordSuccess';

export const ForgotPassword = (props: Except<Props, 'onSubmit'>) => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [success, setSuccess] = useState(false);

  const submit: Props['onSubmit'] = async (input) => {
    try {
      await forgotPassword({
        variables: input,
      });
      setSuccess(true);
    } catch (e) {
      return await handleFormError(e, {
        Default: `Something went wrong. Try again.`, // Shouldn't ever be hit
      });
    }
  };

  return success ? (
    <ForgotPasswordSuccess />
  ) : (
    <ForgotPasswordForm {...props} onSubmit={submit} />
  );
};
