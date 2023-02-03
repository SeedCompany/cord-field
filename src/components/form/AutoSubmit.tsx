import { useDebounceFn } from 'ahooks';
import { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-final-form';

export interface AutoSubmitOptions {
  /** A custom delay between calling submit handler. */
  debounce?: number;
}

export const defaultAutoSubmitOptions: AutoSubmitOptions = {
  debounce: 2_000,
};

/**
 * Prior art:
 * - https://gist.github.com/wyattjoh/f65047d58d5ee9cbe01b805aedb9b07a
 * - https://codesandbox.io/s/5w4yrpyo7k?file=/AutoSave.js
 * - https://codesandbox.io/s/7k742qpo36?file=/AutoSave.js
 * This logic differs from those links in that changes while submitting
 * also queue a submission when the current one finishes.
 * Otherwise, changes would be lost during this window.
 */
export const AutoSubmit = (options: AutoSubmitOptions) => {
  // Even if the submission handler finishes very fast, we want to at least wait
  // this long before calling it again.
  const submit = useDebounceFn(useForm().submit, {
    wait: options.debounce,
    // submit immediately, useful for non text changes, like radio inputs.
    leading: true,
    // if invoked again while waiting, then submit again after waiting.
    trailing: true,
  });

  // Grab current form state
  const { values, dirty, submitting, validating } = useFormState({
    subscription: {
      values: true,
      dirty: true,
      submitting: true,
      validating: true,
    },
  });

  /**
   * A change should always trigger a submission. However, if we call
   * final-form's submit(), while it's already submitting, then it will be ignored.
   * So instead, we store a flag to call it again after the current submission finishes.
   */
  const [needsSubmit, setNeedsSubmit] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void (dirty && setNeedsSubmit(true)), [values]);

  // Call submit() when needed & able
  useEffect(() => {
    const canSubmit = !submitting && !validating;
    if (needsSubmit && canSubmit) {
      void submit.run();
      setNeedsSubmit(false);
    }
  }, [needsSubmit, submitting, validating, submit, setNeedsSubmit]);

  return null;
};
