import { Card, CardActions, CardContent, makeStyles } from '@material-ui/core';
import React from 'react';
import { Form } from 'react-final-form';
import { EmailField, PasswordField, SubmitButton } from '../../components/form';
import { sleep } from '../../util';

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

export const Login = () => {
  const classes = useStyles();

  const submit = async (data: FormValues) => {
    await sleep(1000);
    alert(JSON.stringify(data, undefined, 2));
  };

  return (
    <Form<FormValues> onSubmit={submit}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Card className={classes.card}>
            <CardContent>
              <EmailField fullWidth />
              <PasswordField fullWidth />
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
