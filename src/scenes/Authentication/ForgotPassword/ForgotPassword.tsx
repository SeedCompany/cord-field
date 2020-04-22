import { ApolloError } from '@apollo/client';
import { FORM_ERROR } from 'final-form';
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
    const invalidCondition = {
      [FORM_ERROR]: `Something wasn't right, or email not found, or email not sent. Try again.`,
    };
    try {
      const res = await forgotPassword({
        variables: { email: input.email },
      });

      if (res?.data.forgotPassword) {
        alert(`Recovery email "${input.email}" has been sent.`);
      } else {
        return invalidCondition;
      }
    } catch (e) {
      if (
        e instanceof ApolloError &&
        e.graphQLErrors?.[0]?.extensions?.exception.code !== null
      ) {
        return invalidCondition;
      }
      alert('Forgot password failed. Please contact support.');
      console.log(e);
    }
  };

  return <ForgotPasswordForm {...props} onSubmit={submit} />;
};
