import React from 'react';
import { LoginMutationResult, useLoginMutation } from '../../api';
import { LoginForm } from './LoginForm';

export const Login = () => {
  const [login] = useLoginMutation();

  return (
    <LoginForm
      onSubmit={async (data) => {
        try {
          const res: LoginMutationResult['data'] = await login({
            variables: {
              email: data.email,
              password: data.password,
            },
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
      }}
    />
  );
};
