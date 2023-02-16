import { useApolloClient, useMutation } from '@apollo/client';
import { useMount } from 'ahooks';
import { useNavigate } from 'react-router-dom';
import { AuthWaiting } from '../AuthWaiting';
import { LogoutDocument } from './logout.graphql';

export const Logout = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [logout] = useMutation(LogoutDocument);

  // NOTE: SSR logout is handled independently in server.ts
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  useMount(async () => {
    await logout();
    await client.resetStore();
    navigate('/login', { replace: true });
  });

  return <AuthWaiting />;
};
