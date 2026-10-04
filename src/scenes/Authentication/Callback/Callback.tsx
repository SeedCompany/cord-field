import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { Alert, CircularProgress, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Link, useNavigate } from '../../../components/Routing';
import { updateSessionCache } from '../../../components/Session';
import { AuthContent } from '../AuthContent';
import { LoginWithAuth0Document } from './callback.graphql';

export const Callback = () => {
  const {
    isLoading,
    isAuthenticated,
    error: auth0Error,
    getIdTokenClaims,
  } = useAuth0();
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const [loginWithAuth0] = useMutation(LoginWithAuth0Document);
  const [exchangeError, setExchangeError] = useState<Error>();
  // Guards the mutation from firing more than once (e.g. dependency churn,
  // React 18 StrictMode double-invoking effects in dev).
  const exchangeStarted = useRef(false);

  useEffect(() => {
    if (
      isLoading ||
      auth0Error ||
      !isAuthenticated ||
      exchangeStarted.current
    ) {
      return;
    }
    exchangeStarted.current = true;

    void (async () => {
      try {
        const claims = await getIdTokenClaims();
        const idToken = claims?.__raw;
        if (!idToken) {
          throw new Error('Auth0 did not return an ID token');
        }

        const { data } = await loginWithAuth0({
          variables: { input: { idToken } },
          update: (cache, { data: result }) => {
            const sessionData = result?.loginWithAuth0;
            if (!sessionData) {
              return;
            }
            updateSessionCache(cache, sessionData);
          },
        });
        if (!data?.loginWithAuth0) {
          throw new Error('Sign in did not return a session');
        }

        // `URLSearchParams.get` already undoes the one level of
        // `encodeURIComponent` that `Auth0ProviderWithNavigate`'s
        // `onRedirectCallback` applied when building this `/callback` URL —
        // no further decoding needed here.
        const returnTo = query.get('returnTo');
        navigate(returnTo || '/', { replace: true });
      } catch (e) {
        setExchangeError(
          e instanceof Error ? e : new Error('Failed to complete sign in')
        );
        exchangeStarted.current = false;
      }
    })();
  }, [
    isLoading,
    isAuthenticated,
    auth0Error,
    getIdTokenClaims,
    loginWithAuth0,
    navigate,
    query,
  ]);

  const displayError = auth0Error ?? exchangeError;

  return (
    <>
      <Helmet title="Signing in" />
      <AuthContent>
        {displayError ? (
          <>
            <Alert severity="error">
              Could not complete sign in: {displayError.message}
            </Alert>
            <Typography sx={{ mt: 2 }}>
              <Link to="/login">Back to sign in</Link>
            </Typography>
          </>
        ) : (
          <>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Signing you in…</Typography>
          </>
        )}
      </AuthContent>
    </>
  );
};
