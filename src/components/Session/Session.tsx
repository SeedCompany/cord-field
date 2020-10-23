import { ApolloCache, useQuery } from '@apollo/client';
import { SessionOutput } from '../../api';
import { LoginMutation } from '../../scenes/Authentication/Login/Login.generated';
import { RegisterMutation } from '../../scenes/Authentication/Register/register.generated';
import { LoggedInUserFragment, SessionDocument } from './session.generated';

export const useSession = () => {
  const { data, loading: sessionLoading } = useQuery(SessionDocument);
  const session = data?.session.user;
  const powers = data?.session.powers;

  return { session, sessionLoading, powers };
};

export const updateSessionCache = <T extends LoginMutation | RegisterMutation>(
  cache: ApolloCache<T>,
  sessionData: { user?: LoggedInUserFragment; powers?: SessionOutput['powers'] }
) => {
  const { user, powers } = sessionData;
  const currentSession = cache.readQuery({
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
        powers: [...(powers ? powers : currentSession.session.powers || [])],
      },
    };
    cache.writeQuery({ query: SessionDocument, data: updatedSession });
  }
};
