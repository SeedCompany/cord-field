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
      await forgotPassword({
        variables: { email: input.email },
      });
      // TO DO useSearchQuery hook and redirect to success component when success

      alert(`Recovery email "${input.email}" has been sent.`);
    } catch (e) {
      if (
        e instanceof ApolloError &&
        e.graphQLErrors?.[0]?.extensions?.exception.code !== null
      ) {
        return invalidCondition;
      }
    }
  };

  return <ForgotPasswordForm {...props} onSubmit={submit} />;
};
