import { ReactNode } from 'react';
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
  helperText?: ReactNode
) => {
  const text = showError(meta) ? meta.error || meta.submitError : helperText;
  // always pass a truthy value, aka ' ', so layout doesn't adjust
  // when an error is shown. This is per Material Design.
  return text || ' ';
};
