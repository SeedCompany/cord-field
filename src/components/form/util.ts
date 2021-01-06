import { difference, differenceWith, isEmpty, isEqual } from 'lodash';
import { MutableRefObject, ReactNode, useCallback, useRef } from 'react';
import { FieldMetaState, useFormState } from 'react-final-form';
import { Nullable } from '../../util';

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
      ref.current.focus();
      andDo?.(ref.current);
    }
  }, [ref, andDo]);
  return [focus, ref];
};

export const isEqualBy = <T>(compareBy: (item: T) => any) =>
  compareNullable<T>((a, b) => compareBy(a) === compareBy(b));

export const isListEqualBy = <T>(compareBy: (item: T) => any) =>
  compareNullable<T[]>((a, b) =>
    areListsEqual(a.map(compareBy), b.map(compareBy))
  );

export const areListsEqual = (a: any, b: any) =>
  isEmpty(difference(a, b)) && isEmpty(difference(b, a));

export const areListsDeepEqual = (a: any, b: any) =>
  isEmpty(differenceWith(a, b, isEqual)) &&
  isEmpty(differenceWith(b, a, isEqual));

export const compareNullable = <T>(fn: (a: T, b: T) => boolean) => (
  a: Nullable<T>,
  b: Nullable<T>
) => {
  if (a == null && b == null) {
    return true;
  }
  if ((a == null && b) || (a && b == null)) {
    return false;
  }
  return fn(a!, b!);
};
