import { compact } from 'lodash';
import { useEffect } from 'react';
import { UseFieldConfig, useField as useFinalField } from 'react-final-form';
import { useFirstMountState } from 'react-use';
import { many, Many } from '../../util';
import { useFieldName } from './FieldGroup';
import { useFocus, useIsSubmitting } from './util';
import {
  compose as composeValidators,
  required as requiredValidator,
  Validator,
} from './validators';

export type FieldConfig<Value, T extends HTMLElement = HTMLElement> = Omit<
  UseFieldConfig<Value>,
  'validate'
> & {
  name: string;
  disabled?: boolean;
  required?: boolean;
  validate?: Many<Validator<Value> | null>;
  autoFocus?: boolean;
  /** also do this on focus */
  onFocus?: (el: T) => void;
};

export const useField = <Value, T extends HTMLElement = HTMLElement>({
  validate: validateProp = null,
  required = false,
  name: nameProp,
  disabled: disabledProp,
  onFocus: andDoOnFocus,
  ...restConfig
}: FieldConfig<Value, T>) => {
  // If validate is given and an array compose it to a single function
  // Else default to the required validator if required is true.
  const validate = validateProp
    ? composeValidators(...compact(many(validateProp)))
    : required
    ? requiredValidator
    : undefined;

  const {
    afterSubmit,
    allowNull,
    beforeSubmit,
    defaultValue,
    format,
    formatOnBlur,
    initialValue,
    isEqual,
    multiple,
    parse,
    subscription,
    type,
    validateFields,
    value,
    ...rest
  } = restConfig;

  const name = useFieldName(nameProp);

  const { input, meta } = useFinalField<Value, T>(name, {
    validate,
    ...restConfig,
  });
  const submitting = useIsSubmitting();

  const disabled = disabledProp ?? meta.submitting;

  const firstRender = useFirstMountState();
  const focused = disabled
    ? false
    : restConfig.autoFocus && firstRender
    ? // If auto focus, assume focus on first render.
      // The browser should apply focus, so this is just visual.
      // The state should be fixed on next render in the useEffect call below.
      // This assumption keeps rendered output consistent between SSR and client.
      true
    : meta.active;

  const [focusInDoc, ref] = useFocus<T>(andDoOnFocus);
  const focusInFF = input.onFocus;
  useEffect(() => {
    const activeInDoc = ref.current && ref.current === document.activeElement;

    // Refocus field if it has become re-enabled and is active
    if (!disabled && meta.active && !activeInDoc) {
      focusInDoc();
    }

    // Set field active in FF if doc says it's active
    // This happens on FF initialization/hydration from SSR render
    if (activeInDoc && !meta.active) {
      focusInFF();
    }
  }, [meta.active, disabled, ref, focusInDoc, focusInFF]);

  return {
    input,
    meta: {
      ...meta,
      submitting,
      disabled,
      focused,
    },
    ref,
    rest,
  };
};
