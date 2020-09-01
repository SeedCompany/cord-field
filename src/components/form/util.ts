import { difference, isEmpty } from 'lodash';
import {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { FieldMetaState, useFormState } from 'react-final-form';

export const useIsSubmitting = () => {
  const { submitting } = useFormState({ subscription: { submitting: true } });
  return submitting;
};

export const showError = (meta: FieldMetaState<any>) =>
  ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
  meta.touched;

export const getHelperText = (
  meta: FieldMetaState<any>,
  helperText?: ReactNode,
  hasError?: boolean,
  disableEmptySpacing?: boolean
) => {
  const text =
    hasError ?? showError(meta) ? meta.error || meta.submitError : helperText;
  // always pass a truthy value, aka ' ', so layout doesn't adjust
  // when an error is shown. This is per Material Design.
  return text || (disableEmptySpacing ? '' : ' ');
};

/**
 * Helper hook to focus element attached to ref
 */
export const useFocus = <T extends { focus: () => void } = HTMLElement>(
  andDo?: (el: T) => void
): [() => void, MutableRefObject<T | null>] => {
  const ref = useRef<T | null>(null);
  const focus = useCallback(() => {
    if (ref.current) {
      setTimeout(() => {
        if (!ref.current) {
          return;
        }
        ref.current.focus();
        andDo?.(ref.current);
      }, 100);
    }
  }, [ref, andDo]);
  return [focus, ref];
};

/**
 * Focus field if it is enabled and is active.
 * When fields are disabled they lose focus so this fixes that.
 */
export const useFocusOnEnabled = <
  T extends { focus: () => void } = HTMLElement
>(
  meta: FieldMetaState<unknown>,
  disabled: boolean,
  andDoOnFocus?: (el: T) => void
) => {
  // Refocus field if it has become re-enabled and is active
  const [focus, ref] = useFocus<T>(andDoOnFocus);
  useEffect(() => {
    if (!disabled && meta.active) {
      focus();
    }
  }, [meta.active, disabled, focus]);
  return ref;
};

export const areListsEqual = (a: any, b: any) =>
  isEmpty(difference(a, b)) && isEmpty(difference(b, a));

export const compareNullable = <T>(fn: (a: T, b: T) => boolean) => (
  a: T,
  b: T
) => {
  if (a == null && b == null) {
    return true;
  }
  if ((a == null && b) || (a && b == null)) {
    return false;
  }
  return fn(a, b);
};
