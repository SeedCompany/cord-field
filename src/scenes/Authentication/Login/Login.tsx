import { ApolloError } from '@apollo/client';
import { FORM_ERROR } from 'final-form';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Except } from 'type-fest';
import { useLoginMutation } from '../../../api';
import { useSession } from '../../../components/Session';
import { LoginForm, LoginFormProps as Props } from './LoginForm';

export const Login = (props: Except<Props, 'onSubmit'>) => {
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const [session, sessionLoading, setUserSession] = useSession();

  useEffect(() => {
    if (!sessionLoading && session) {
      navigate('/');
    }
  }, [navigate, session, sessionLoading]);

  const submit: Props['onSubmit'] = async (input) => {
    const invalidCreds = {
      [FORM_ERROR]: `Something wasn't right. Try again, or reset password.`,
    };
    try {
      const { data } = await login({
        variables: { input },
      });

      // TODO: Navigate to a returnTo place if it exists.
      navigate('/');

      setUserSession(data.login.user);
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
