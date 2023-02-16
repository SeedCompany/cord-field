import { useApolloClient, useMutation } from '@apollo/client';
import { useMount } from 'ahooks';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImpersonationContext } from '~/api/client/ImpersonationContext';
import { sleep as delay } from '~/common';
import { AuthWaiting } from '../AuthWaiting';
import { LogoutDocument } from './logout.graphql';

export const Logout = () => {
  const navigate = useNavigate();
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
    navigate('/login', { replace: true });
  });

  return <AuthWaiting />;
};
