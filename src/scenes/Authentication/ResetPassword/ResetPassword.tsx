import { ApolloError } from '@apollo/client';
import { FORM_ERROR } from 'final-form';
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
    const invalidCondition = {
      [FORM_ERROR]: `Token expired. Try again.`,
    };
    try {
      input.token = resetPasswordToken as string;
      const res = await resetPassword({
        variables: { input },
      });

      if (res?.data.resetPassword) {
        alert('Successfully reset password');
      }
    } catch (e) {
      if (
        e instanceof ApolloError &&
        e.graphQLErrors?.[0]?.extensions?.exception.code !== null
      ) {
        return invalidCondition;
      }
      alert('Reset password failed. Please contact support.');
      console.log(e);
    }
  };

  return <ResetPasswordForm {...props} onSubmit={submit} />;
};
