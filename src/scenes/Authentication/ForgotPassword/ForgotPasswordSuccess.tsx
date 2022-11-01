import { Typography } from '@mui/material';
import { ButtonLink } from '../../../components/Routing';
import { AuthContent } from '../AuthContent';

export const ForgotPasswordSuccess = ({ email }: { email: string }) => {
  return (
    <AuthContent>
      <Typography variant="h3" align="center" sx={{ mb: 3 }}>
        Check Your Email
      </Typography>
      <Typography align="center" sx={{ mb: 5 }}>
        Please check the email address {email} for instructions to reset your
        password.
      </Typography>
      <ButtonLink
        to="/login"
        color="secondary"
        size="large"
        variant="contained"
        fullWidth
      >
        Back to Log In
      </ButtonLink>
    </AuthContent>
  );
};
