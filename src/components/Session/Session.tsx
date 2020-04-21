import constate from 'constate';
import { useEffect, useState } from 'react';
import { LoggedInUserFragment, useSessionQuery } from '../../api';

export type SessionUser = LoggedInUserFragment;

function Session() {
  const [userSession, setUserSession] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { loading: loadingSession, error, data } = useSessionQuery();

  useEffect(() => {
    if (!loadingSession || error) {
      if (data?.session.user) {
        setUserSession(data?.session.user);
      }

      setLoading(false);
    }
    setUserSession(data?.session.user || null);
  }, [loadingSession, error, data, setUserSession, setLoading]);

  return [userSession, loading, setUserSession] as const;
}

export const [SessionProvider, useSession] = constate(Session);
