import { FormApi, FormState, getIn, Unsubscribe } from 'final-form';
import { noop } from 'ts-essentials';

// Updated type to use generic
const get = getIn as <T, K>(state: T, complexKey: K) => any;

/**
 * Focuses the first field to register.
 */
export function focusFirstFieldRegistered<T, I>(
  form: FormApi<T, I>
): Unsubscribe {
  const originalRegister = form.registerField;

  let firstField: keyof T | undefined;
  form.registerField = (...args) => {
    // @ts-expect-error type definition doesn't define this
    const fieldUnsubscribe = originalRegister.apply(form, args);
    if (firstField) {
      return fieldUnsubscribe;
    }
    firstField = args[0];
    setTimeout(() => firstField && form.focus(firstField), 0);
    return () => {
      firstField = undefined;
      fieldUnsubscribe();
    };
  };
  return () => {
    form.registerField = originalRegister;
  };
}

/**
 * Focuses the first field to have a submit error.
 * Be sure to use blurOnSubmit decorator with this one.
 */
export function focusFirstFieldWithSubmitError<T, I>(
  form: FormApi<T, I>
): Unsubscribe {
  const originalSubmit = form.submit;

  let state: Partial<Pick<FormState<T, I>, 'errors' | 'submitErrors'>> = {};
  const unsubscribe = form.subscribe(
    (next) => {
      state = next;
    },
    {
      errors: true,
      submitErrors: true,
    }
  );

  const afterSubmit = () => {
    if (state.errors && Object.keys(state.errors).length) {
      for (const field of form.getRegisteredFields() as Array<keyof T>) {
        const err = get(state.errors, field);
        if (err) {
          form.focus(field);
          break;
        }
      }
    } else if (state.submitErrors && Object.keys(state.submitErrors).length) {
      for (const field of form.getRegisteredFields() as Array<keyof T>) {
        const err = get(state.submitErrors, field);
        if (err) {
          form.focus(field);
          break;
        }
      }
    }
  };

  form.submit = () => {
    const result = originalSubmit.call(form);
    if (result && typeof result.then === 'function') {
      result.then(afterSubmit, noop);
    } else {
      afterSubmit();
    }
    return result;
  };
  return () => {
    unsubscribe();
    form.submit = originalSubmit;
  };
}

/**
 * Focuses the last active field after a submit error.
 * Be sure to use blurOnSubmit decorator with this one.
 */
export function focusLastActiveFieldOnSubmitError<T, I>(
  form: FormApi<T, I>
): Unsubscribe {
  let lastActive: keyof T | undefined;
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
export function blurOnSubmit<T, I>(form: FormApi<T, I>): Unsubscribe {
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
export const matchFieldIfSame = (source: string, dest: string) => <T, I>(
  form: FormApi<T, I>
): Unsubscribe => {
  let prevInitialValues: I;
  let prevValues: T;
  return form.subscribe(
    ({ initialValues, values, active }) => {
      if (!prevValues || prevInitialValues !== initialValues) {
        prevValues = (initialValues as unknown) as T;
      }
      prevInitialValues = initialValues;
      if (active === source) {
        const prevSrc = get(prevValues, source);
        const prevDest = get(prevValues, dest);
        const newA = get(values, source);
        if (prevSrc !== newA && prevDest === prevSrc) {
          form.change(dest as keyof T, newA);
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
