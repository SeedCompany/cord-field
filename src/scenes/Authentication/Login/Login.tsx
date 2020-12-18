import { useMutation } from '@apollo/client';
import { FORM_ERROR } from 'final-form';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMountedState } from 'react-use';
import { Except } from 'type-fest';
import { handleFormError } from '../../../api';
import { updateSessionCache, useSession } from '../../../components/Session';
import { LoginDocument } from './Login.generated';
import { LoginForm, LoginFormProps as Props } from './LoginForm';

export const Login = (props: Except<Props, 'onSubmit'>) => {
  const [login] = useMutation(LoginDocument);
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const { session, sessionLoading } = useSession();
  const [success, setSuccess] = useState(false);
  const isMounted = useMountedState();

  // Redirect to homepage if already logged in (and not from successful login)
  useEffect(() => {
    if (!sessionLoading && session && !success) {
      navigate('/', { replace: true });
    }
  }, [navigate, session, sessionLoading, success]);

  const submit: Props['onSubmit'] = async (input, form) => {
    try {
      await login({
        variables: { input },
        update: (cache, { data }) => {
          const sessionData = data?.login;
          if (!sessionData) {
            return;
          }
          updateSessionCache(cache, sessionData);
          if (isMounted()) {
            setSuccess(true);
          }
        },
      });
      const returnTo = decodeURIComponent(query.get('returnTo') ?? '/');
      navigate(returnTo, { replace: true });
    } catch (e) {
      return await handleFormError(e, form, {
        Default: {
          [FORM_ERROR]: `Something wasn't right. Try again, or reset password.`,
          // Add errors to fields so they show invalid
          email: ' ',
          password: ' ',
        },
      });
    }
  };

  return (
    <>
      <Helmet title="Login" />
      <LoginForm {...props} onSubmit={submit} />
    </>
  );
};
Login.fetchData = async () => {
  return {
    random: Math.random(),
  };
};
