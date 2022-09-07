import { CircularProgress } from '@mui/material';
import { AuthContent } from './AuthContent';

export const AuthWaiting = () => (
  <AuthContent>
    <CircularProgress />
  </AuthContent>
);
