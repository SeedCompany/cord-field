import { Card, CardContent } from '@material-ui/core';
import { Decorator, Mutator } from 'final-form';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import { UserEmailInput } from '../../../api';
import {
  blurOnSubmit,
  EmailField,
  focusLastActiveFieldOnSubmitError,
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
  <Form
    {...props}
    onSubmit={async (...args) => {
      const res = await props.onSubmit(...args);
      return res
        ? {
            ...res,
          }
        : undefined;
    }}
    decorators={decorators}
    mutators={{ clearSubmitErrors }}
  >
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

// Since email is not in db or recovery email was not sent to clear.
const clearSubmitErrorsOnChange: Decorator<UserEmailInput> = (form) =>
  form.subscribe(
    ({ dirtySinceLastSubmit }) => {
      if (dirtySinceLastSubmit) {
        form.mutators.clearSubmitErrors();
      }
    },
    { dirtySinceLastSubmit: true }
  );

const clearSubmitErrors: Mutator<UserEmailInput> = (args, state) => {
  state.formState = {
    ...state.formState,
    submitError: undefined,
    submitErrors: undefined,
  };
};

const decorators = [
  clearSubmitErrorsOnChange,
  blurOnSubmit,
  focusLastActiveFieldOnSubmitError,
];
