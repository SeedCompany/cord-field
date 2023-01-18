import { FORM_ERROR, setIn } from 'final-form';
import { cloneDeep, omit } from 'lodash';
import { Children, forwardRef, useMemo } from 'react';
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
export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  function SubmitButton(
    { children, spinner = true, action, disabled, ...rest },
    ref
  ) {
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
    const fieldSubmitErrors = useMemo(
      () => omit(submitErrors ?? {}, FORM_ERROR),
      [submitErrors]
    );

    const allFieldsTouched = touched
      ? Object.values(touched).every((field) => field)
      : false;

    const allFieldsWithSubmitErrorsAreDirty = useMemo(() => {
      if (!submitErrors || Object.keys(fieldSubmitErrors).length === 0) {
        return true;
      }
      const unchangedSubmitErrors = Object.keys(
        dirtyFieldsSinceLastSubmit
      ).reduce(
        (remaining: Partial<typeof fieldSubmitErrors> | undefined, field) => {
          return remaining ? setIn(remaining, field, undefined) : undefined;
        },
        cloneDeep(fieldSubmitErrors)
      );
      return (
        !unchangedSubmitErrors ||
        Object.keys(unchangedSubmitErrors).length === 0
      );
    }, [submitErrors, fieldSubmitErrors, dirtyFieldsSinceLastSubmit]);

    return (
      <ProgressButton
        color="error"
        size="large"
        fullWidth
        variant="contained"
        {...rest}
        onClick={(e) => {
          rest.onClick?.(e);
          if (e.isPropagationStopped()) {
            return;
          }
          e.preventDefault();
          form.change('submitAction', action);

          void form.submit();
        }}
        type="submit"
        disabled={
          disabled ||
          submitting ||
          validating ||
          (allFieldsTouched && hasValidationErrors) ||
          // disable if there are submit/server errors for specific fields
          // and they have not been changed since last submit
          !allFieldsWithSubmitErrorsAreDirty
        }
        progress={spinner && submitting && values.submitAction === action}
        ref={ref}
      >
        {Children.count(children) ? children : 'Submit'}
      </ProgressButton>
    );
  }
);
