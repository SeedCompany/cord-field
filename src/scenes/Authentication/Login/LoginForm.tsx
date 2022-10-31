import { Box, Typography } from '@mui/material';
import { Decorator, Mutator } from 'final-form';
import { sample } from 'lodash';
import { useState } from 'react';
import { Form, FormProps } from 'react-final-form';
import { LoginInput } from '~/api/schema.graphql';
import { extendSx, StyleProps } from '~/common';
import {
  blurOnSubmit,
  EmailField,
  focusLastActiveFieldOnSubmitError,
  PasswordField,
  SubmitButton,
  SubmitError,
} from '../../../components/form';
import { CordIcon } from '../../../components/Icons';
import { Link } from '../../../components/Routing';
import { AuthContent } from '../AuthContent';

interface Quote {
  quote: string;
  reference: string;
}
const quotes: Quote[] = [
  {
    quote: `Be strong and courageous. Do not be frightened, and do not be
            dismayed, for the LORD your God is with you wherever you go.`,
    reference: 'Joshua 1:9',
  },
];

export type LoginFormProps = Pick<
  FormProps<LoginInput>,
  'onSubmit' | 'initialValues'
>;

export const LoginForm = (props: LoginFormProps) => {
  const [quote] = useState(() => sample(quotes)!);
  return (
    <AuthContent>
      <Footer
        quote={quote}
        sx={{
          visibility: 'hidden',
          '@media (max-height: 700px)': {
            display: 'none',
          },
        }}
      />
      <div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CordIcon sx={{ fontSize: 64, margin: 'auto', mb: 4 }} />
          <Typography variant="h4" gutterBottom={true}>
            CORD FIELD
          </Typography>
          <Typography color="textSecondary">
            Accelerating Bible Translation
          </Typography>
        </Box>
        <Form
          {...props}
          decorators={decorators}
          mutators={{ clearSubmitErrors }}
        >
          {({ handleSubmit }) => (
            // post method to ensure credentials are not passed in url if form
            // is submitted before client-side javascript can pick the event.
            <form method="post" onSubmit={handleSubmit}>
              <SubmitError sx={{ my: 2 }} />
              <EmailField autoFocus autoComplete="email" />
              <PasswordField autoComplete="current-password" />
              <SubmitButton sx={{ mt: 1 }}>Sign In</SubmitButton>
            </form>
          )}
        </Form>
        <Box
          sx={{
            mt: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/register">Register</Link>
        </Box>
      </div>
      <Footer quote={quote} />
    </AuthContent>
  );
};

const Footer = ({
  quote: { quote, reference },
  ...props
}: JSX.IntrinsicElements['footer'] & { quote: Quote } & StyleProps) => {
  return (
    <Box
      component="footer"
      className={props.className}
      sx={[
        {
          maxWidth: 500,
          mt: 5,
          textAlign: 'center',
        },
        ...extendSx(props.sx),
      ]}
    >
      <Typography
        color="textSecondary"
        sx={{
          fontStyle: 'italic',
        }}
      >
        “{quote}”
      </Typography>
      <Typography color="textSecondary" variant="h4" sx={{ mt: 1 }}>
        {reference}
      </Typography>
    </Box>
  );
};

// Since email and password are invalid as a pair we need to clear
// both errors from both fields when either of them change.
const clearSubmitErrorsOnChange: Decorator<LoginInput> = (form) =>
  form.subscribe(
    ({ dirtySinceLastSubmit }) => {
      if (dirtySinceLastSubmit) {
        form.mutators.clearSubmitErrors!();
      }
    },
    { dirtySinceLastSubmit: true }
  );

const clearSubmitErrors: Mutator<LoginInput> = (args, state) => {
  state.formState = {
    ...state.formState,
    submitError: undefined,
    submitErrors: undefined,
  };
};

// decorators get re-created if array identity changes
// so make constant outside of render function
const decorators = [
  clearSubmitErrorsOnChange,
  blurOnSubmit,
  focusLastActiveFieldOnSubmitError,
];
