import { Card, CardActions, CardContent, makeStyles } from '@material-ui/core';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import { EmailField, PasswordField, SubmitButton } from '../../components/form';

const useStyles = makeStyles({
  card: {
    maxWidth: 400,
    margin: 'auto',
  },
});

interface FormValues {
  email: string;
  password: string;
}

export const LoginForm = (props: FormProps<FormValues>) => {
  const classes = useStyles();
  return (
    <Form<FormValues> {...props}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Card className={classes.card}>
            <CardContent>
              <EmailField />
              <PasswordField />
            </CardContent>
            <CardActions>
              <SubmitButton />
            </CardActions>
          </Card>
        </form>
      )}
    </Form>
  );
};
