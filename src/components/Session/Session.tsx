import { ApolloCache } from '@apollo/client';
import { LoginMutation } from '../../scenes/Authentication/Login/Login.generated';
import { RegisterMutation } from '../../scenes/Authentication/Register/register.generated';
import {
  LoggedInUserFragment,
  SessionDocument,
  SessionQuery,
  useSessionQuery,
} from './session.generated';

export const useSession = () => {
  const { data, loading: sessionLoading } = useSessionQuery();
  const session = data?.session.user;

  return { session, sessionLoading };
};

export const updateSessionCache = <T extends LoginMutation | RegisterMutation>(
  cache: ApolloCache<T>,
  user: LoggedInUserFragment
) => {
  const currentSession = cache.readQuery<SessionQuery>({
    query: SessionDocument,
  });
  if (currentSession) {
    const updatedSession = {
      ...currentSession,
      session: {
        ...currentSession.session,
        user: {
          ...currentSession.session.user,
          ...user,
        },
      },
    };
    cache.writeQuery({ query: SessionDocument, data: updatedSession });
  }
};
