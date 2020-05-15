import { useApolloClient } from '@apollo/client';
import constate from 'constate';
import { useCallback, useEffect } from 'react';
import {
  LoggedInUserFragment,
  SessionDocument,
  SessionQuery,
  useSessionLazyQuery,
} from './session.generated';

export type SessionUser = LoggedInUserFragment;

function Session({ user }: { user?: SessionUser | null }) {
  const client = useApolloClient();
  const [getSession, { loading, data, called }] = useSessionLazyQuery();
  const setSession = useCallback(
    (user: SessionUser | null) =>
      client.writeQuery<SessionQuery>({
        query: SessionDocument,
        data: {
          session: {
            user,
          },
        },
      }),
    [client]
  );
  useEffect(() => {
    if (user !== undefined) {
      setSession(user);
    }
    getSession();
  }, [user, getSession, setSession]);

  return [data?.session.user, called ? loading : true, setSession] as const;
}

export const [SessionProvider, useSession] = constate(Session);
