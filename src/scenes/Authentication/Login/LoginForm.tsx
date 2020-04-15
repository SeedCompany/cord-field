import { Card, CardContent } from '@material-ui/core';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import { LoginInput } from '../../../api';
import {
  EmailField,
  PasswordField,
  SubmitButton,
} from '../../../components/form';

export type LoginFormProps = Pick<
  FormProps<LoginInput>,
  'onSubmit' | 'initialValues'
> & { className?: string };

export const LoginForm = ({ className, ...props }: LoginFormProps) => (
  <Form {...props}>
    {({ handleSubmit }) => (
      <Card component="form" onSubmit={handleSubmit} className={className}>
        <CardContent>
          <EmailField placeholder="Enter Email Address" />
          <PasswordField placeholder="Enter Password" />
          <SubmitButton />
        </CardContent>
      </Card>
    )}
  </Form>
);
