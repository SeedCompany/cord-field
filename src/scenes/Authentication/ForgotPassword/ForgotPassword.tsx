import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Except } from 'type-fest';
import { handleFormError } from '../../../api';
import { ForgotPasswordDocument } from './ForgotPassword.graphql';
import {
  ForgotPasswordForm,
  ForgotPasswordFormProps as Props,
} from './ForgotPasswordForm';
import { ForgotPasswordSuccess } from './ForgotPasswordSuccess';

export const ForgotPassword = (props: Except<Props, 'onSubmit'>) => {
  const [forgotPassword] = useMutation(ForgotPasswordDocument);
  const [email, setEmail] = useState<string | null>(null);

  const submit: Props['onSubmit'] = async (input, form) => {
    try {
      await forgotPassword({
        variables: input,
      });
      setEmail(input.email);
    } catch (e) {
      return await handleFormError(e, form, {
        // Shouldn't ever be hit
        Default: `Something wasn't right. Try again or contact Support.`,
      });
    }
  };

  const out = email ? (
    <ForgotPasswordSuccess email={email} />
  ) : (
    <ForgotPasswordForm {...props} onSubmit={submit} />
  );
  return (
    <>
      <Helmet title="Forgot Password" />
      {out}
    </>
  );
};
