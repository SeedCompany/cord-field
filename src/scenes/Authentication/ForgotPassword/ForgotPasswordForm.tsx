import { Card, CardContent } from '@material-ui/core';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import { QueryCheckEmailArgs } from '../../../api';
import { EmailField, SubmitButton } from '../../../components/form';

export type ForgotPasswordFormProps = Pick<
  FormProps<QueryCheckEmailArgs>,
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
          <EmailField placeholder="Enter Email Address" />
          <SubmitButton />
        </CardContent>
      </Card>
    )}
  </Form>
);
