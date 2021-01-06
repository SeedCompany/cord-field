import { compact } from 'lodash';
import { useEffect } from 'react';
import { UseFieldConfig, useField as useFinalForm } from 'react-final-form';
import { many, Many } from '../../util';
import { useFieldName, validators } from './index';
import { useFocus, useIsSubmitting } from './util';
import { Validator } from './validators';

export type FieldConfig<Value, T extends HTMLElement = HTMLElement> = Omit<
  UseFieldConfig<Value>,
  'validate'
> & {
  name: string;
  disabled?: boolean;
  required?: boolean;
  validate?: Many<Validator<Value> | null>;
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
    ? validators.compose(...compact(many(validateProp)))
    : required
    ? validators.required
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

  const { input, meta } = useFinalForm<Value, T>(name, {
    validate,
    ...restConfig,
  });
  const submitting = useIsSubmitting();

  const disabled = disabledProp ?? meta.submitting;

  // Refocus field if it has become re-enabled and is active
  // When fields are disabled they lose focus so this fixes that.
  const [focus, ref] = useFocus<T>(andDoOnFocus);
  useEffect(() => {
    if (!disabled && meta.active) {
      focus();
    }
  }, [meta.active, disabled, focus]);

  return {
    input,
    meta: {
      ...meta,
      submitting,
      disabled,
    },
    ref,
    rest,
  };
};
