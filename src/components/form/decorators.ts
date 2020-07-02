import { Decorator, FormApi, getIn, Unsubscribe } from 'final-form';

// Updated type to use generic
const get = getIn as <T>(state: T, complexKey: string) => any;

/**
 * Focuses the first field to have a submit error.
 * Be sure to use blurOnSubmit decorator with this one.
 */
export function focusFirstFieldWithSubmitError<T>(
  form: FormApi<T>
): Unsubscribe {
  let wasSubmitting = false;
  return form.subscribe(
    ({ submitting, submitFailed, submitErrors }) => {
      if (wasSubmitting && !submitting && submitFailed) {
        wasSubmitting = false;
        for (const field of form.getRegisteredFields()) {
          if (submitErrors?.[field]) {
            form.focus(field);
            break;
          }
        }
      }
      if (submitting) {
        wasSubmitting = true;
      }
    },
    {
      submitting: true,
      submitFailed: true,
      submitErrors: true,
    }
  );
}

/**
 * Focuses the last active field after a submit error.
 * Be sure to use blurOnSubmit decorator with this one.
 */
export function focusLastActiveFieldOnSubmitError<T>(
  form: FormApi<T>
): Unsubscribe {
  let lastActive: string | undefined;
  let wasSubmitting = false;
  return form.subscribe(
    ({ active, submitting, submitFailed }) => {
      if (
        wasSubmitting &&
        !submitting &&
        submitFailed &&
        !active &&
        lastActive
      ) {
        wasSubmitting = false;
        form.focus(lastActive);
      }
      if (submitting) {
        wasSubmitting = true;
      }
      if (active) {
        lastActive = active;
      }
    },
    {
      active: true,
      submitting: true,
      submitFailed: true,
    }
  );
}

/**
 * Since we disable our fields on submit, the field that FF thinks is active
 * is actually not active anymore. This informs FF of that.
 * This really only matters when we are trying to automatically focus fields.
 * Without this a field could become re-active after submission and compete
 * with another to try and focus. Since it's an imperative call one could
 * clobber the other.
 * This seems to be an issue when submitting via enter key since the lack of
 * blur event creates the stale state. Clicking off the field, even to click
 * the submit button, triggers the field to blur which informs FF to remove
 * the active property.
 */
export function blurOnSubmit<T>(form: FormApi<T>): Unsubscribe {
  return form.subscribe(
    ({ submitting, active }) => {
      if (submitting && active) {
        form.blur(active);
      }
    },
    {
      submitting: true,
      active: true,
    }
  );
}

/**
 * Decorator to update dest field with source field value as long as dest field
 * value continues to match source field. This allows dest to be in sync until
 * it is changed by user.
 */
export const matchFieldIfSame = <T>(
  source: string,
  dest: string
): Decorator<T> => (form) => {
  let prevInitialValues: T;
  let prevValues: T;
  return form.subscribe(
    ({ initialValues, values, active }) => {
      if (!prevValues || prevInitialValues !== initialValues) {
        prevValues = initialValues;
      }
      prevInitialValues = initialValues;
      if (active === source) {
        const prevSrc = get(prevValues, source);
        const prevDest = get(prevValues, dest);
        const newA = get(values, source);
        if (prevSrc !== newA && prevDest === prevSrc) {
          form.change(dest, newA);
        }
      }
      prevValues = values;
    },
    {
      values: true,
      initialValues: true,
      active: true,
    }
  );
};
