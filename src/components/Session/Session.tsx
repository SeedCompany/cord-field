import { ApolloCache, useQuery } from '@apollo/client';
import { pickBy } from 'lodash';
import LogRocket from 'logrocket';
import { useEffect } from 'react';
import { SessionOutput } from '../../api';
import { LoginMutation } from '../../scenes/Authentication/Login/Login.graphql';
import { RegisterMutation } from '../../scenes/Authentication/Register/register.graphql';
import { LoggedInUserFragment, SessionDocument } from './session.graphql';

export const useSession = () => {
  const { data, loading: sessionLoading } = useQuery(SessionDocument, {
    ssr: true,
  });
  const session = data?.session.user;
  const powers = data?.session.powers;

  return { session, sessionLoading, powers };
};

export const updateSessionCache = <T extends LoginMutation | RegisterMutation>(
  cache: ApolloCache<T>,
  sessionData: { user: LoggedInUserFragment; powers: SessionOutput['powers'] }
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

export const useBetaFeatures = () =>
  useSession().powers?.includes('BetaFeatures');

export const useIdentifyInLogRocket = () => {
  const { session: user } = useSession();
  useEffect(() => {
    if (!user) {
      return;
    }
    LogRocket.identify(
      user.id,
      pickBy({
        name: user.fullName,
        email: user.email.value,
        timezone: user.timezone.value?.name,
      }) as Record<string, string>
    );
  }, [user]);
};
