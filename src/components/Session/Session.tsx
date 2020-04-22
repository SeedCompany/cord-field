import constate from 'constate';
import {
  LoggedInUserFragment,
  SessionDocument,
  SessionQuery,
  useSessionQuery,
} from '../../api';

export type SessionUser = LoggedInUserFragment;

function Session() {
  const { loading, data, client } = useSessionQuery();
  const setSession = (user: LoggedInUserFragment) =>
    client.writeQuery<SessionQuery>({
      query: SessionDocument,
      data: {
        session: {
          user,
        },
      },
    });

  return [data?.session.user, loading, setSession] as const;
}

export const [SessionProvider, useSession] = constate(Session);
