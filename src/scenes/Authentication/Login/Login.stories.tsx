import { Alert, CircularProgress, Typography } from '@mui/material';
import { AuthContent } from '../AuthContent';

export default { title: 'Scenes/Authentication/Login' };

// `Login` itself is wired directly to `useAuth0()`/`useSession()`, so these
// stories render the same presentational states standalone (mirroring the
// mock-driven cases in Login.test.tsx) rather than the connected component.

export const Redirecting = () => (
  <AuthContent>
    <CircularProgress />
    <Typography sx={{ mt: 2 }}>Redirecting to sign in…</Typography>
  </AuthContent>
);

export const Error = () => (
  <AuthContent>
    <Alert severity="error">
      Could not redirect to sign in: Auth0 is not configured
    </Alert>
  </AuthContent>
);
