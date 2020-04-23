import { ApolloError } from '@apollo/client';
import { FORM_ERROR } from 'final-form';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Except } from 'type-fest';
import { useResetPasswordMutation } from '../../../api';
import {
  ResetPasswordFormProps as Props,
  ResetPasswordForm,
} from './ResetPasswordForm';
import { ResetPasswordSuccess } from './ResetPasswordSuccess';

export const ResetPassword = (props: Except<Props, 'onSubmit'>) => {
  const [resetPassword] = useResetPasswordMutation();
  const { token } = useParams<{ token: string }>();
  const [success, setSuccess] = useState(false);

  const submit: Props['onSubmit'] = async ({ password }) => {
    const invalidCondition = {
      [FORM_ERROR]: `Token expired. Try again.`,
    };
    try {
      await resetPassword({
        variables: {
          input: {
            token,
            password,
          },
        },
      });
      alert('Successfully reset password');
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
    <ResetPasswordSuccess />
  ) : (
    <ResetPasswordForm {...props} onSubmit={submit} />
  );
};
