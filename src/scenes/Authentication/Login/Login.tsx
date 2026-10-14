import { useAuth0 } from '@auth0/auth0-react';
import { Alert, CircularProgress, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from '../../../components/Routing';
import { useSession } from '../../../components/Session';
import { useIsomorphicEffect } from '../../../hooks';
import { AuthContent } from '../AuthContent';

export const Login = () => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const { session, sessionLoading } = useSession();
  const [error, setError] = useState<Error>();
  // Guards against double-firing loginWithRedirect (e.g. React 18 StrictMode
  // double-invoking effects in dev, or dependency churn before the browser
  // actually navigates away).
  const attempted = useRef(false);

  // Redirect to homepage if a Cord session already exists — unchanged from
  // the password-login flow.
  useIsomorphicEffect(() => {
    if (!sessionLoading && session) {
      const returnTo = decodeURIComponent(query.get('returnTo') ?? '/');
      navigate(returnTo, { replace: true });
    }
  }, [navigate, query, session, sessionLoading]);

  // Kick off the Auth0 Universal Login redirect. This only has real work to
  // do client-side — Auth0Provider isn't part of the SSR tree — and only
  // once: on success the whole page navigates away to Auth0, so there's
  // nothing left to render here unless it fails (e.g. Auth0 isn't configured
  // yet in this environment, which is expected in local dev until a real
  // Auth0 application exists).
  useEffect(() => {
    if (
      sessionLoading ||
      session ||
      isLoading ||
      isAuthenticated ||
      attempted.current
    ) {
      return;
    }
    attempted.current = true;
    const returnTo = query.get('returnTo') ?? undefined;
    void (async () => {
      try {
        await loginWithRedirect({ appState: { returnTo } });
      } catch (e) {
        setError(
          e instanceof Error ? e : new Error('Failed to redirect to sign in')
        );
        attempted.current = false;
      }
    })();
  }, [
    sessionLoading,
    session,
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    query,
  ]);

  return (
    <>
      <Helmet title="Login" />
      <AuthContent>
        {error ? (
          <Alert severity="error">
            Could not redirect to sign in: {error.message}
          </Alert>
        ) : (
          <>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Redirecting to sign in…</Typography>
          </>
        )}
      </AuthContent>
    </>
  );
};
