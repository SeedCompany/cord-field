import { ApolloCache, useQuery } from '@apollo/client';
import { useAsyncEffect } from 'ahooks';
import { pickBy } from 'lodash';
import { PostHog } from 'posthog-js';
import { usePostHog } from 'posthog-js/react';
import { SessionOutput } from '~/api/schema.graphql';
import { LoginMutation } from '../../scenes/Authentication/Login/Login.graphql';
import { RegisterMutation } from '../../scenes/Authentication/Register/register.graphql';
import {
  FeaturesFragment as BetaFeatures,
  LoggedInUserFragment,
  SessionDocument,
} from './session.graphql';

export const useSession = () => {
  const { data, loading: sessionLoading } = useQuery(SessionDocument, {
    ssr: true,
  });
  const session = data?.session.user;
  const impersonator = data?.session.impersonator;
  const powers = data?.session.powers;
  const betaFeatures = data?.session.betaFeatures;

  return { session, sessionLoading, impersonator, powers, betaFeatures };
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

export const useBetaFeatures = (): ReadonlySet<keyof BetaFeatures> =>
  new Set(
    Object.entries(useSession().betaFeatures || {}).flatMap(([key, value]) =>
      value ? (key as keyof BetaFeatures) : []
    )
  );

export const useIdentifyInLogRocket = () => {
  const { session, impersonator } = useSession();
  const user = impersonator ?? session;

  const postHog = usePostHog() as PostHog | null;

  useAsyncEffect(async () => {
    if (!user) {
      return;
    }
    postHog?.identify(user.id, {
      Name: user.fullName,
      Email: user.email.value,
      Roles: user.roles.value,
    });

    if (process.env.RAZZLE_LOG_ROCKET_APP_ID) {
      const LogRocket = await import('logrocket');
      LogRocket.default.identify(
        user.id,
        pickBy({
          name: user.fullName,
          email: user.email.value,
          roles: user.roles.value.join(','),
          timezone: user.timezone.value?.name,
        }) as Record<string, string>
      );
    }
  }, [user]);
};
