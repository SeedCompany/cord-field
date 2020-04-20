import { FORM_ERROR } from 'final-form';
import { difference } from 'lodash';
import { FC } from 'react';
import * as React from 'react';
import { useForm, useFormState } from 'react-final-form';
import { ProgressButton, ProgressButtonProps } from '../ProgressButton';

export type SubmitButtonProps = {
  /** Whether to show progress while submitting */
  spinner?: boolean;
} & Omit<ProgressButtonProps, 'type' | 'disabled' | 'progress'>;

/**
 * A Submit Button for a form. Handles when button should be disabled
 * and when to show progress spinner (if enabled).
 */
export const SubmitButton: FC<SubmitButtonProps> = ({
  children,
  spinner = true,
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
  } = useFormState({
    subscription: {
      submitErrors: true,
      dirtyFieldsSinceLastSubmit: true,
      hasValidationErrors: true,
      submitting: true,
      touched: true,
      validating: true,
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
      color="secondary"
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
      progress={spinner && submitting}
    >
      {React.Children.count(children) ? children : 'Submit'}
    </ProgressButton>
  );
};
