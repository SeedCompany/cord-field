import { Typography } from '@mui/material';
import { ButtonLink } from '../../../components/Routing';
import { AuthContent } from '../AuthContent';

export const ResetPasswordSuccess = () => {
  return (
    <AuthContent>
      <Typography variant="h3" align="center" sx={{ mb: 3 }}>
        Your Password Has Been Reset
      </Typography>
      <Typography align="center" sx={{ mb: 5 }}>
        Your password has been saved. Use the link below to log in with your new
        password.
      </Typography>
      <ButtonLink
        to="/login"
        color="secondary"
        size="large"
        variant="contained"
        fullWidth
      >
        Continue to Log In
      </ButtonLink>
    </AuthContent>
  );
};
