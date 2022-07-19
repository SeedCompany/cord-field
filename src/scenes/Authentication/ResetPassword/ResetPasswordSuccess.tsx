import { makeStyles, Typography } from '@material-ui/core';
import { ButtonLink } from '../../../components/Routing';
import { AuthContent } from '../AuthContent';

const useStyles = makeStyles(({ spacing }) => ({
  title: {
    marginBottom: spacing(3),
  },
  body: {
    marginBottom: spacing(5),
  },
}));

export const ResetPasswordSuccess = () => {
  const classes = useStyles();
  return (
    <AuthContent>
      <Typography variant="h3" align="center" className={classes.title}>
        Your Password Has Been Reset
      </Typography>
      <Typography align="center" className={classes.body}>
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
