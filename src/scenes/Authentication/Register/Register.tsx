import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Except } from 'type-fest';
import { handleFormError } from '../../../api';
import { updateSessionCache, useSession } from '../../../components/Session';
import { useRegisterMutation } from './register.generated';
import { RegisterFormProps as Props, RegisterForm } from './RegisterForm';

export const Register = (props: Except<Props, 'onSubmit'>) => {
  const [register] = useRegisterMutation();
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const { session, sessionLoading } = useSession();
  const [success, setSuccess] = useState(false);

  // Redirect to homepage if already logged in (and not from successful login)
  useEffect(() => {
    if (!sessionLoading && session && !success) {
      navigate('/', { replace: true });
    }
  }, [navigate, session, sessionLoading, success]);

  const submit: Props['onSubmit'] = async ({ confirmPassword, ...input }) => {
    try {
      await register({
        variables: {
          input: {
            ...input,
            timezone: DateTime.local().zone.name,
          },
        },
        update: (cache, { data }) => {
          const user = data?.register.user;
          if (user) {
            updateSessionCache(cache, user);
          }
        },
      });
      setSuccess(true);
      const returnTo = decodeURIComponent(query.get('returnTo') ?? '/');
      navigate(returnTo, { replace: true });
    } catch (e) {
      return await handleFormError(e);
    }
  };

  return <RegisterForm {...props} onSubmit={submit} />;
};
