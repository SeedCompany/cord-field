import { compact } from 'lodash';
import { ReactNode } from 'react';
import { UseFieldConfig, useField as useFinalForm } from 'react-final-form';
import { many, Many } from '../../util';
import { useFieldName, validators } from './index';
import {
  getHelperText,
  showError,
  useFocusOnEnabled,
  useIsSubmitting,
} from './util';
import { Validator } from './validators';

export type FieldConfig<Value> = Omit<UseFieldConfig<Value>, 'validate'> & {
  required?: boolean;
  validate?: Many<Validator<Value> | null>;
};

export const useField = <Value, P, T extends HTMLElement = HTMLElement>(
  name: string,
  config: FieldConfig<Value> & P
) => {
  const {
    validate: validateInput = null,
    required = false,
    ...restConfig
  } = config;

  // If validate is given and an array compose it to a single function
  // Else default to the required validator if required is true.
  const validate = validateInput
    ? validators.compose(...compact(many(validateInput)))
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

  const { input, meta } = useFinalForm<Value, T>(name, {
    validate,
    ...restConfig,
  });
  const submitting = useIsSubmitting();

  return {
    input,
    meta: { ...meta, submitting },
    rest,
  };
};

export const useField2 = <Value>({
  name: nameProp,
  disabled: disabledProp,
  helperText,
  ...config
}: FieldConfig<Value> & {
  name: string;
  disabled?: boolean;
  helperText?: ReactNode;
}) => {
  const name = useFieldName(nameProp);
  const { input, meta, rest } = useField<Value>(name, config);
  const disabled = disabledProp ?? meta.submitting;
  const inputRef = useFocusOnEnabled(meta, disabled);
  return {
    input,
    meta,
    rest: {
      ...rest,
      disabled,
      inputRef,
      helperText: getHelperText(meta, helperText),
      error: showError(meta),
    },
  };
};
