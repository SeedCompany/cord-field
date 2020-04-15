import React from 'react';
import { Except } from 'type-fest';
import { useLoginMutation } from '../../../api';
import { LoginForm, LoginFormProps as Props } from './LoginForm';

export const Login = (props: Except<Props, 'onSubmit'>) => {
  const [login] = useLoginMutation();

  const submit: Props['onSubmit'] = async (input) => {
    try {
      const res = await login({
        variables: { input },
      });

      // TODO: post-login authentication (session storage, etc)
      if (res?.login.success) {
        alert(`Welcome ${res.login.user?.realFirstName.value}`);
      } else {
        alert('Login failed. Please check your email or password.');
      }
    } catch (e) {
      alert('Login failed. Please contact support.');
      console.log(e);
    }
  };

  return <LoginForm {...props} onSubmit={submit} />;
};
