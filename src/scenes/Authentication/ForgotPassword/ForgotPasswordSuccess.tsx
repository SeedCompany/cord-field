import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { ButtonLink } from '../../../components/Routing';
import { AuthContent } from '../AuthContent';

const useStyles = makeStyles()(({ spacing }) => ({
  title: {
    marginBottom: spacing(3),
  },
  body: {
    marginBottom: spacing(5),
  },
}));

export const ForgotPasswordSuccess = ({ email }: { email: string }) => {
  const { classes } = useStyles();
  return (
    <AuthContent>
      <Typography variant="h3" align="center" className={classes.title}>
        Check Your Email
      </Typography>
      <Typography align="center" className={classes.body}>
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
