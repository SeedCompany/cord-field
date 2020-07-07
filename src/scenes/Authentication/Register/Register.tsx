import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Except } from 'type-fest';
import { handleFormError } from '../../../api';
import { useSession } from '../../../components/Session';
import { useRegisterMutation } from './register.generated';
import { RegisterFormProps as Props, RegisterForm } from './RegisterForm';

export const Register = (props: Except<Props, 'onSubmit'>) => {
  const [register] = useRegisterMutation();
  const navigate = useNavigate();
  const [query] = useSearchParams();
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
      const { data } = await register({
        variables: {
          input: {
            displayFirstName: input.firstName,
            displayLastName: input.lastName,
            realFirstName: input.firstName,
            realLastName: input.lastName,
            email: input.email,
            password: input.password,
            timezone: DateTime.local().zone.name,
          },
        },
      });
      setSuccess(true);
      setUserSession(data!.register.user);
      const returnTo = decodeURIComponent(query.get('returnTo') ?? '/');
      navigate(returnTo, { replace: true });
    } catch (e) {
      return await handleFormError(e);
    }
  };

  return <RegisterForm {...props} onSubmit={submit} />;
};
