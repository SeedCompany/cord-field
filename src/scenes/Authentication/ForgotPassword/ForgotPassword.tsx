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
  const [email, setEmail] = useState<string | null>(null);

  const submit: Props['onSubmit'] = async (input) => {
    try {
      await forgotPassword({
        variables: input,
      });
      setEmail(input.email);
    } catch (e) {
      return await handleFormError(e, {
        // Shouldn't ever be hit
        Default: `Something wasn't right. Try again or contact Support.`,
      });
    }
  };

  return email ? (
    <ForgotPasswordSuccess email={email} className={props.className} />
  ) : (
    <ForgotPasswordForm {...props} onSubmit={submit} />
  );
};
