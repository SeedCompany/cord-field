import { ApolloError } from '@apollo/client';
import { FORM_ERROR } from 'final-form';
import React from 'react';
import { Except } from 'type-fest';
import { useLoginMutation } from '../../../api';
import { LoginForm, LoginFormProps as Props } from './LoginForm';

export const Login = (props: Except<Props, 'onSubmit'>) => {
  const [login] = useLoginMutation();

  const submit: Props['onSubmit'] = async (input) => {
    const invalidCreds = {
      [FORM_ERROR]: `Something wasn't right. Try again, or reset password.`,
    };
    try {
      const res = await login({
        variables: { input },
      });

      // TODO: post-login authentication (session storage, etc)
      if (res?.login.success) {
        alert(`Welcome ${res.login.user?.realFirstName.value}`);
      } else {
        return invalidCreds;
      }
    } catch (e) {
      if (
        e instanceof ApolloError &&
        e.graphQLErrors?.[0]?.extensions?.exception.status === 401
      ) {
        return invalidCreds;
      }
      alert('Login failed. Please contact support.');
      console.log(e);
    }
  };

  return <LoginForm {...props} onSubmit={submit} />;
};
