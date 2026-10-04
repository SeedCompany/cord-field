import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { ChildrenProp } from '~/common';
import { useNavigate } from '~/components/Routing';

/**
 * Client-only wrapper around `@auth0/auth0-react`'s `Auth0Provider`.
 *
 * `domain`/`clientId` come from `RAZZLE_AUTH0_DOMAIN`/`RAZZLE_AUTH0_CLIENT_ID`.
 * Webpack rewrites `process.env` to `window.env` in the client bundle (see
 * `define('process.env', 'window.env')` in razzle.config.js), and
 * `renderServerSideApp.tsx` populates `window.env` from the server's actual
 * process env at request time (gated by `BROWSER_SAFE_RAZZLE_KEYS`) — so this
 * reads live, per-deployment config rather than values baked in at build
 * time.
 *
 * Both vars are blank until a real Auth0 application exists. We still render
 * `Auth0Provider` unconditionally (rather than skipping it) so `isLoading`
 * resolves to `false` after its init attempt — leaving the stub/no-provider
 * context (where `isLoading` is permanently `true`) would make `Login.tsx`
 * spin forever instead of surfacing the "Auth0 isn't configured" error.
 *
 * No persisted token storage (`cacheLocation="memory"`) — the ID token is
 * only used transiently during the `/callback` exchange, then discarded. The
 * httpOnly Cord session cookie remains the only persistent auth artifact,
 * exactly as today.
 */
export const Auth0ProviderWithNavigate = ({ children }: ChildrenProp) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState) => {
    navigate(
      appState?.returnTo
        ? `/callback?returnTo=${encodeURIComponent(appState.returnTo)}`
        : '/callback',
      { replace: true }
    );
  };

  return (
    <Auth0Provider
      domain={process.env.RAZZLE_AUTH0_DOMAIN ?? ''}
      clientId={process.env.RAZZLE_AUTH0_CLIENT_ID ?? ''}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
      }}
      cacheLocation="memory"
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
