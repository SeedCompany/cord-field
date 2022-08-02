import { CircularProgress } from '@material-ui/core';
import { AuthContent } from './AuthContent';

export const AuthWaiting = () => (
  <AuthContent>
    <CircularProgress />
  </AuthContent>
);
