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
  const { hasValidationErrors, submitting, touched, validating } = useFormState(
    {
      subscription: {
        hasValidationErrors: true,
        submitting: true,
        touched: true,
        validating: true,
      },
    }
  );
  const allFieldsTouched = touched
    ? Object.values(touched).every((field) => field)
    : false;
  return (
    <ProgressButton
      color="primary"
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
        submitting || validating || (allFieldsTouched && hasValidationErrors)
      }
      progress={spinner && submitting}
    >
      {React.Children.count(children) ? children : 'Submit'}
    </ProgressButton>
  );
};
