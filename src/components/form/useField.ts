import { compact } from 'lodash';
import { UseFieldConfig, useField as useFinalForm } from 'react-final-form';
import { many, Many } from '../../util';
import { useFieldName, validators } from './index';
import { useIsSubmitting } from './util';
import { Validator } from './validators';

export type FieldConfig<Value> = Omit<UseFieldConfig<Value>, 'validate'> & {
  name: string;
  disabled?: boolean;
  required?: boolean;
  validate?: Many<Validator<Value> | null>;
};

export const useField = <Value, T extends HTMLElement = HTMLElement>({
  validate: validateProp = null,
  required = false,
  name: nameProp,
  disabled: disabledProp,
  ...restConfig
}: FieldConfig<Value>) => {
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

  return {
    input,
    meta: { ...meta, submitting, disabled: disabledProp ?? meta.submitting },
    rest,
  };
};
