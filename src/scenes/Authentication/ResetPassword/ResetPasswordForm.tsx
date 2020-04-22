import { Card, CardContent } from '@material-ui/core';
import { Decorator, Mutator } from 'final-form';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import { ResetPasswordInput } from '../../../api';
import {
  blurOnSubmit,
  focusLastActiveFieldOnSubmitError,
  SubmitButton,
  SubmitError,
  TextField,
} from '../../../components/form';

export type ResetPasswordFormProps = Pick<
  FormProps<ResetPasswordInput>,
  'onSubmit' | 'initialValues'
> & { className?: string };

export const ResetPasswordForm = ({
  className,
  ...props
}: ResetPasswordFormProps) => (
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
          <TextField
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

const clearSubmitErrorsOnChange: Decorator<ResetPasswordInput> = (form) =>
  form.subscribe(
    ({ dirtySinceLastSubmit }) => {
      if (dirtySinceLastSubmit) {
        form.mutators.clearSubmitErrors();
      }
    },
    { dirtySinceLastSubmit: true }
  );

const clearSubmitErrors: Mutator<ResetPasswordInput> = (args, state) => {
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
