import React from 'react';
import { sleep } from '../../util';
import { LoginForm } from './LoginForm';

export const Login = () => {
  return (
    <LoginForm
      onSubmit={async (data) => {
        await sleep(1000);
        alert(JSON.stringify(data, undefined, 2));
      }}
    />
  );
};
