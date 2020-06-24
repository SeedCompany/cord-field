import { FORM_ERROR } from 'final-form';
import { difference } from 'lodash';
import { FC } from 'react';
import * as React from 'react';
import { useForm, useFormState } from 'react-final-form';
import { ProgressButton, ProgressButtonProps } from '../ProgressButton';

export type SubmitButtonProps = {
  /** Whether to show progress while submitting */
  spinner?: boolean;
  /**
   * Override the submit action
   * This allows the form to have different submit actions.
   * The action, if custom, will be in the submit data as `submitAction`.
   */
  action?: string;
} & Omit<
  ProgressButtonProps,
  | 'type'
  | 'disabled'
  | 'progress'
  // I really wanted to use `action` for submit action
  // and I've yet to use the `Button.action` prop anywhere ever.
  | 'action'
>;

export interface SubmitAction<T extends string = string> {
  submitAction?: T;
}

/**
 * A Submit Button for a form. Handles when button should be disabled
 * and when to show progress spinner (if enabled).
 */
export const SubmitButton: FC<SubmitButtonProps> = ({
  children,
  spinner = true,
  action,
  ...rest
}) => {
  const form = useForm('SubmitButton');
  const {
    hasValidationErrors,
    submitting,
    touched,
    validating,
    submitErrors,
    dirtyFieldsSinceLastSubmit,
    values,
  } = useFormState({
    subscription: {
      submitErrors: true,
      dirtyFieldsSinceLastSubmit: true,
      hasValidationErrors: true,
      submitting: true,
      touched: true,
      validating: true,
      values: true,
    },
  });
  // Ignore FORM_ERROR since it doesn't count as it doesn't go to a field.
  // We'll assume that the form _can_ be re-submitted with these errors.
  // It could be a server error, connection error, etc.
  const { [FORM_ERROR]: _, ...fieldSubmitErrors } = submitErrors ?? {};

  const allFieldsTouched = touched
    ? Object.values(touched).every((field) => field)
    : false;
  return (
    <ProgressButton
      color="error"
      size="large"
      fullWidth
      variant="contained"
      {...rest}
      onClick={(e) => {
        rest.onClick && rest.onClick(e);
        if (e.isPropagationStopped()) {
          return;
        }
        e.preventDefault();
        form.change('submitAction', action);

        return form.submit();
      }}
      type="submit"
      disabled={
        submitting ||
        validating ||
        (allFieldsTouched && hasValidationErrors) ||
        // disable if there are submit/server errors for specific fields
        // and they have not been changed since last submit
        (submitErrors &&
          difference(
            Object.keys(fieldSubmitErrors),
            Object.keys(dirtyFieldsSinceLastSubmit)
          ).length > 0)
      }
      progress={spinner && submitting && values.submitAction === action}
    >
      {React.Children.count(children) ? children : 'Submit'}
    </ProgressButton>
  );
};
