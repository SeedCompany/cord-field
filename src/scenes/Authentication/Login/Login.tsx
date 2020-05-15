import { FORM_ERROR } from 'final-form';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Except } from 'type-fest';
import { handleFormError } from '../../../api';
import { useSession } from '../../../components/Session';
import { useLoginMutation } from './Login.generated';
import { LoginForm, LoginFormProps as Props } from './LoginForm';

export const Login = (props: Except<Props, 'onSubmit'>) => {
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const [query] = useSearchParams('') as [URLSearchParams];
  const [session, sessionLoading, setUserSession] = useSession();
  const [success, setSuccess] = useState(false);

  // Redirect to homepage if already logged in (and not from successful login)
  useEffect(() => {
    if (!sessionLoading && session && !success) {
      navigate('/', { replace: true });
    }
  }, [navigate, session, sessionLoading, success]);

  const submit: Props['onSubmit'] = async (input) => {
    try {
      const { data } = await login({
        variables: { input },
      });
      setSuccess(true);
      setUserSession(data!.login.user);
      const returnTo = decodeURIComponent(query.get('returnTo') ?? '/');
      navigate(returnTo, { replace: true });
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
