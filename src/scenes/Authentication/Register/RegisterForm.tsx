import { Box, Grid, Typography } from '@mui/material';
import { Decorator, Mutator } from 'final-form';
import { Form, FormProps } from 'react-final-form';
import { RegisterInput } from '~/api/schema.graphql';
import {
  blurOnSubmit,
  EmailField,
  focusFirstFieldWithSubmitError,
  matchFieldIfSame,
  PasswordField,
  SubmitButton,
  SubmitError,
  TextField,
} from '../../../components/form';
import { minLength, required } from '../../../components/form/validators';
import { CordIcon } from '../../../components/Icons';
import { Link } from '../../../components/Routing';
import { AuthContent } from '../AuthContent';

export interface RegisterFields extends RegisterInput {
  confirmPassword: string;
}

export type RegisterFormProps = Pick<
  FormProps<RegisterFields>,
  'onSubmit' | 'initialValues'
>;

export const RegisterForm = (props: RegisterFormProps) => {
  return (
    <AuthContent
      sx={(theme) => ({
        [theme.breakpoints.up('md')]: {
          maxWidth: 700,
        },
      })}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CordIcon
          sx={{
            fontSize: 64,
            m: 'auto',
            mb: 4,
          }}
        />
        <Typography variant="h4" gutterBottom={true}>
          CORD FIELD
        </Typography>
        <Typography color="textSecondary">
          Accelerating Bible Translation
        </Typography>
      </Box>
      <Form
        {...props}
        validate={passwordMatching}
        decorators={decorators}
        mutators={{ markConfirmPasswordTouched }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <SubmitError sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="realFirstName"
                  label="First Name"
                  placeholder="Enter First Name"
                  required
                  validate={[required, minLength()]}
                  margin="none"
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="realLastName"
                  label="Last Name"
                  placeholder="Enter Last Name"
                  required
                  validate={[required, minLength()]}
                  margin="none"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="displayFirstName"
                  label="Public First Name"
                  placeholder="Enter Public First Name"
                  required
                  validate={[required, minLength()]}
                  margin="none"
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="displayLastName"
                  label="Public Last Name"
                  placeholder="Enter Public Last Name"
                  required
                  validate={[required, minLength()]}
                  margin="none"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <EmailField caseSensitive autoComplete="email" margin="none" />
              </Grid>
              <Grid item xs={12} md={6}>
                <PasswordField autoComplete="new-password" margin="none" />
              </Grid>
              <Grid item xs={12} md={6}>
                <PasswordField
                  name="confirmPassword"
                  label="Re-Type Password"
                  placeholder="Re-Enter Your Password"
                  autoComplete="new-password"
                  margin="none"
                />
              </Grid>
            </Grid>
            <SubmitButton sx={{ mt: 1 }}>Sign Up</SubmitButton>
          </form>
        )}
      </Form>
      <Link to="/login" sx={{ display: 'inline-block', mt: 1 }}>
        Already have an account? Login
      </Link>
    </AuthContent>
  );
};

export const passwordMatching = ({
  password,
  confirmPassword,
  ..._otherVals
}: RegisterFields) => {
  return password && confirmPassword && password !== confirmPassword
    ? {
        password: 'Passwords must match',
        confirmPassword: 'Passwords must match',
      }
    : undefined;
};

const showMatchingErrorsImmediately: Decorator<RegisterFields> = (form) =>
  form.subscribe(
    ({ active, values }) => {
      if (active === 'confirmPassword' && values.confirmPassword) {
        form.mutators.markConfirmPasswordTouched!();
      }
    },
    { active: true, values: true }
  );

export const markConfirmPasswordTouched: Mutator<RegisterFields> = (
  args,
  state
) => {
  state.fields.confirmPassword!.touched = true;
};

// decorators get re-created if array identity changes
// so make constant outside of render function
const decorators = [
  matchFieldIfSame('realFirstName', 'displayFirstName'),
  matchFieldIfSame('realLastName', 'displayLastName'),
  showMatchingErrorsImmediately,
  blurOnSubmit,
  focusFirstFieldWithSubmitError,
];
