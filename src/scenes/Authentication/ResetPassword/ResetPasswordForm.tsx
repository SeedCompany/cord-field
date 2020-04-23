import { Card, CardContent } from '@material-ui/core';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import { ResetPasswordInput } from '../../../api';
import {
  PasswordField,
  SubmitButton,
  SubmitError,
} from '../../../components/form';

export type ResetPasswordFormProps = Pick<
  FormProps<ResetPasswordInput>,
  'onSubmit' | 'initialValues'
> & { className?: string };

export const ResetPasswordForm = ({
  className,
  ...props
}: ResetPasswordFormProps) => (
  <Form {...props}>
    {({ handleSubmit }) => (
      <Card component="form" onSubmit={handleSubmit} className={className}>
        <CardContent>
          <SubmitError />
          <PasswordField
            name="password"
            placeholder="Enter New Password"
            required
          />
          <SubmitButton />
        </CardContent>
      </Card>
    )}
  </Form>
);
