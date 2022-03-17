import { makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { Decorator, Mutator } from 'final-form';
import { sample } from 'lodash';
import React, { useState } from 'react';
import { Form, FormProps } from 'react-final-form';
import { LoginInput } from '../../../api';
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

const useStyles = makeStyles(({ spacing }) => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    margin: 'auto',
    marginBottom: spacing(4),
  },
  formError: {
    margin: spacing(2, 0),
  },
  submit: {
    marginTop: spacing(1),
  },
  otherLinks: {
    marginTop: spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
  },
  footer: {
    maxWidth: 500,
    marginTop: spacing(5),
    textAlign: 'center',
  },
  footerSpacer: {
    visibility: 'hidden',
    '@media (max-height: 700px)': {
      display: 'none',
    },
  },
  verse: {
    fontStyle: 'italic',
  },
  reference: {
    marginTop: spacing(1),
  },
}));

export type LoginFormProps = Pick<
  FormProps<LoginInput>,
  'onSubmit' | 'initialValues'
>;

export const LoginForm = (props: LoginFormProps) => {
  const classes = useStyles();
  const [quote] = useState(() => sample(quotes)!);
  return (
    <AuthContent>
      <Footer quote={quote} className={classes.footerSpacer} />
      <div>
        <div className={classes.header}>
          <CordIcon className={classes.icon} />
          <Typography variant="h4" gutterBottom={true}>
            CORD FIELD
          </Typography>
          <Typography color="textSecondary">
            Accelerating Bible Translation
          </Typography>
        </div>
        <Form
          {...props}
          decorators={decorators}
          mutators={{ clearSubmitErrors }}
        >
          {({ handleSubmit }) => (
            // post method to ensure credentials are not passed in url if form
            // is submitted before client-side javascript can pick the event.
            <form method="post" onSubmit={handleSubmit}>
              <SubmitError className={classes.formError} />
              <EmailField autoFocus autoComplete="email" />
              <PasswordField autoComplete="current-password" />
              <SubmitButton className={classes.submit}>Sign In</SubmitButton>
            </form>
          )}
        </Form>
        <div className={classes.otherLinks}>
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
      <Footer quote={quote} />
    </AuthContent>
  );
};

const Footer = ({
  quote: { quote, reference },
  ...props
}: JSX.IntrinsicElements['footer'] & { quote: Quote }) => {
  const classes = useStyles();
  return (
    <footer {...props} className={clsx(classes.footer, props.className)}>
      <Typography color="textSecondary" className={classes.verse}>
        “{quote}”
      </Typography>
      <Typography
        color="textSecondary"
        variant="h4"
        className={classes.reference}
      >
        {reference}
      </Typography>
    </footer>
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
