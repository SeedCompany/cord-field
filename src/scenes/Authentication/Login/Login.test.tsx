import { useAuth0 } from '@auth0/auth0-react';
import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useSession } from '../../../components/Session';
import { Login } from './Login';

// `@auth0/auth0-react` is a third-party SDK boundary — not our own
// Apollo/Session code — so mocking its `useAuth0` hook directly is the
// sanctioned exception here (same spirit as the `components/Session` mock
// below).
jest.mock('@auth0/auth0-react');
const mockUseAuth0 = useAuth0 as jest.MockedFunction<typeof useAuth0>;

jest.mock('../../../components/Session', () => ({
  useSession: jest.fn(),
}));
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeAuth0 = (overrides: Partial<ReturnType<typeof useAuth0>> = {}) =>
  ({
    isLoading: false,
    isAuthenticated: false,
    error: undefined,
    user: undefined,
    loginWithRedirect: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  } as unknown as ReturnType<typeof useAuth0>);

const makeSession = (overrides: Partial<ReturnType<typeof useSession>> = {}) =>
  ({
    session: undefined,
    sessionLoading: false,
    impersonator: undefined,
    powers: undefined,
    betaFeatures: undefined,
    ...overrides,
  } as unknown as ReturnType<typeof useSession>);

// Minimal fixture for an already-logged-in `session.user` — only `id` is
// read by the component under test (the redirect-away effect just checks
// truthiness), so the rest of `LoggedInUserFragment` is intentionally
// omitted rather than padded out with noise.
const makeLoggedInSessionUser = (): ReturnType<typeof useSession>['session'] =>
  ({ id: 'user-1' } as unknown as ReturnType<typeof useSession>['session']);

const renderLogin = (initialEntries: string[] = ['/login']) => {
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>Home</div>} />
          <Route path="/projects" element={<div>Projects</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );
};

beforeEach(() => {
  mockUseSession.mockReturnValue(makeSession());
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Login', () => {
  it('redirects to Auth0 with returnTo parsed from the query param', async () => {
    const loginWithRedirect = jest.fn().mockResolvedValue(undefined);
    mockUseAuth0.mockReturnValue(makeAuth0({ loginWithRedirect }));

    renderLogin(['/login?returnTo=%2Fprojects']);

    await waitFor(() => {
      expect(loginWithRedirect).toHaveBeenCalledWith({
        appState: { returnTo: '/projects' },
      });
    });
  });

  it('redirects away immediately if a Cord session already exists', async () => {
    const loginWithRedirect = jest.fn().mockResolvedValue(undefined);
    mockUseAuth0.mockReturnValue(makeAuth0({ loginWithRedirect }));
    mockUseSession.mockReturnValue(
      makeSession({ session: makeLoggedInSessionUser() })
    );

    renderLogin();

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
    expect(loginWithRedirect).not.toHaveBeenCalled();
  });

  it('shows an inline error if loginWithRedirect rejects', async () => {
    const loginWithRedirect = jest
      .fn()
      .mockRejectedValue(new Error('Auth0 is not configured'));
    mockUseAuth0.mockReturnValue(makeAuth0({ loginWithRedirect }));

    renderLogin();

    await waitFor(() => {
      expect(
        screen.getByText(
          /Could not redirect to sign in: Auth0 is not configured/
        )
      ).toBeInTheDocument();
    });
  });
});
