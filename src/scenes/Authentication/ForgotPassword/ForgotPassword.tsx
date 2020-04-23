import { ApolloError } from '@apollo/client';
import { FORM_ERROR } from 'final-form';
import React, { useState } from 'react';
import { Except } from 'type-fest';
import { useForgotPasswordMutation } from '../../../api';
import {
  ForgotPasswordForm,
  ForgotPasswordFormProps as Props,
} from './ForgotPasswordForm';
import { ForgotPasswordSuccess } from './ForgotPasswordSuccess';

export const ForgotPassword = (props: Except<Props, 'onSubmit'>) => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [success, setSuccess] = useState(false);

  const submit: Props['onSubmit'] = async (input) => {
    const invalidCondition = {
      [FORM_ERROR]: `Something wasn't right, or email not found, or email not sent. Try again.`,
    };
    try {
      await forgotPassword({
        variables: input,
      });
      alert(`Recovery email "${input.email}" has been sent.`);
      setSuccess(true);
    } catch (e) {
      if (
        e instanceof ApolloError &&
        e.graphQLErrors?.[0]?.extensions?.exception.code !== null
      ) {
        return invalidCondition;
      }
    }
  };

  return success ? (
    <ForgotPasswordSuccess />
  ) : (
    <ForgotPasswordForm {...props} onSubmit={submit} />
  );
};
