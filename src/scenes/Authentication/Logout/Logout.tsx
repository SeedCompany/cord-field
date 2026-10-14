import { useApolloClient, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { delay } from '@seedcompany/common';
import { useMount } from 'ahooks';
import { useContext } from 'react';
import { ImpersonationContext } from '~/api/client/ImpersonationContext';
import { AuthWaiting } from '../AuthWaiting';
import { LogoutDocument } from './logout.graphql';

export const Logout = () => {
  const { logout: auth0Logout } = useAuth0();
  const client = useApolloClient();
  const [logout] = useMutation(LogoutDocument);
  const impersonation = useContext(ImpersonationContext);

  // NOTE: SSR logout is handled independently in server.ts
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  useMount(async () => {
    impersonation.set(); // clear
    await delay(100); // give time to reset store if needed.
    await logout();
    await client.resetStore();
    // Redirects the browser to Auth0's hosted logout, which then returns to
    // /login — replaces the old plain navigate('/login') now that Auth0 owns
    // its own session too.
    await auth0Logout({
      logoutParams: { returnTo: `${window.location.origin}/login` },
    });
  });

  return <AuthWaiting />;
};
