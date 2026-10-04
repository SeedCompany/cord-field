import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';
import { useAuth0 } from '@auth0/auth0-react';
import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SessionDocument } from '~/components/Session/session.graphql';
import { Callback } from './Callback';
import { LoginWithAuth0Document } from './callback.graphql';

// `@auth0/auth0-react` is a third-party SDK boundary — mocking its `useAuth0`
// hook directly is the sanctioned exception here. Apollo stays real
// (`MockedProvider`), per house style.
jest.mock('@auth0/auth0-react');
const mockUseAuth0 = useAuth0 as jest.MockedFunction<typeof useAuth0>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeAuth0 = (overrides: Partial<ReturnType<typeof useAuth0>> = {}) =>
  ({
    isLoading: false,
    isAuthenticated: false,
    error: undefined,
    user: undefined,
    getIdTokenClaims: jest.fn().mockResolvedValue({ __raw: 'raw-id-token' }),
    ...overrides,
  } as unknown as ReturnType<typeof useAuth0>);

const makeLoggedInUser = (overrides = {}) => ({
  __typename: 'User',
  id: 'user-1',
  fullName: 'Ada Lovelace',
  email: { __typename: 'SecuredStringNullable', value: 'ada@example.com' },
  timezone: { __typename: 'SecuredTimeZone', value: null },
  roles: { __typename: 'SecuredRoles', value: [], assignableRoles: [] },
  realFirstName: { __typename: 'SecuredString', value: 'Ada' },
  realLastName: { __typename: 'SecuredString', value: 'Lovelace' },
  displayFirstName: { __typename: 'SecuredString', value: 'Ada' },
  displayLastName: { __typename: 'SecuredString', value: 'Lovelace' },
  ...overrides,
});

const loginWithAuth0Mock = (idToken = 'raw-id-token'): MockedResponse => ({
  request: {
    query: LoginWithAuth0Document,
    variables: { input: { idToken } },
  },
  result: {
    data: {
      loginWithAuth0: {
        __typename: 'LoggedIn',
        user: makeLoggedInUser(),
        powers: [],
      },
    },
  },
});

const seededCache = () => {
  const cache = new InMemoryCache();
  cache.writeQuery({
    query: SessionDocument,
    data: {
      session: {
        __typename: 'SessionOutput',
        user: null,
        impersonator: null,
        betaFeatures: {
          __typename: 'BetaFeatures',
          projectChangeRequests: false,
        },
        powers: [],
      },
    },
  });
  return cache;
};

const renderCallback = (
  mocks: readonly MockedResponse[] = [],
  {
    initialEntries = ['/callback'],
    cache,
  }: { initialEntries?: string[]; cache?: InMemoryCache } = {}
) => {
  render(
    <HelmetProvider>
      <MockedProvider mocks={mocks} cache={cache}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/callback" element={<Callback />} />
            <Route path="/login" element={<div>Login</div>} />
            <Route path="/" element={<div>Home</div>} />
            <Route path="/projects" element={<div>Projects</div>} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </HelmetProvider>
  );
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Callback', () => {
  it('shows a spinner while Auth0 is still loading', () => {
    mockUseAuth0.mockReturnValue(makeAuth0({ isLoading: true }));

    renderCallback();

    expect(screen.getByText('Signing you in…')).toBeInTheDocument();
  });

  it('shows an inline error and a link back to /login if Auth0 errors', () => {
    mockUseAuth0.mockReturnValue(
      makeAuth0({ error: new Error('bad state parameter') })
    );

    renderCallback();

    expect(
      screen.getByText(/Could not complete sign in: bad state parameter/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Back to sign in' })
    ).toHaveAttribute('href', '/login');
  });

  it('exchanges the ID token, updates the session cache, and navigates to returnTo', async () => {
    mockUseAuth0.mockReturnValue(makeAuth0({ isAuthenticated: true }));
    const cache = seededCache();

    renderCallback([loginWithAuth0Mock()], {
      initialEntries: ['/callback?returnTo=%2Fprojects'],
      cache,
    });

    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    const updated = cache.readQuery({ query: SessionDocument });
    expect(updated?.session.user?.id).toBe('user-1');
    expect(updated?.session.user?.fullName).toBe('Ada Lovelace');
  });

  it('navigates home when there is no returnTo', async () => {
    mockUseAuth0.mockReturnValue(makeAuth0({ isAuthenticated: true }));

    renderCallback([loginWithAuth0Mock()], { cache: seededCache() });

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });
});
