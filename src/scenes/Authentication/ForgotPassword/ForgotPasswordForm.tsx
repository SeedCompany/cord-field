import { Card, CardContent } from '@material-ui/core';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import { UserEmailInput } from '../../../api';
import {
  EmailField,
  SubmitButton,
  SubmitError,
} from '../../../components/form';

export type ForgotPasswordFormProps = Pick<
  FormProps<UserEmailInput>,
  'onSubmit' | 'initialValues'
> & { className?: string };

export const ForgotPasswordForm = ({
  className,
  ...props
}: ForgotPasswordFormProps) => (
  <Form {...props}>
    {({ handleSubmit }) => (
      <Card component="form" onSubmit={handleSubmit} className={className}>
        <CardContent>
          <SubmitError />
          <EmailField placeholder="Enter Email Address" />
          <SubmitButton />
        </CardContent>
      </Card>
    )}
  </Form>
);
