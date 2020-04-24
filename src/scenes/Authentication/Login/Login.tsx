import { FORM_ERROR } from 'final-form';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Except } from 'type-fest';
import { handleFormError, useLoginMutation } from '../../../api';
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
    try {
      const { data } = await login({
        variables: { input },
      });

      // TODO: Navigate to a returnTo place if it exists.
      navigate('/');

      setUserSession(data.login.user);
    } catch (e) {
      return await handleFormError(e, {
        Default: {
          [FORM_ERROR]: `Something wasn't right. Try again, or reset password.`,
          // Add errors to fields so they show invalid
          email: ' ',
          password: ' ',
        },
      });
    }
  };

  return <LoginForm {...props} onSubmit={submit} />;
};
