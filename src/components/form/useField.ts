import { identity } from 'lodash';
import { useEffect } from 'react';
import { UseFieldConfig, useField as useFinalField } from 'react-final-form';
import { Except } from 'type-fest';
import { callSome, Many, many, Nullable } from '~/common';
import { useFirstMountState } from '~/hooks';
import { useFieldName } from './FieldGroup';
import { isEqualBy, isListEqualBy, useFocus, useIsSubmitting } from './util';
import {
  requiredArray as requiredArrayValidator,
  required as requiredValidator,
  Validator,
} from './validators';

export type Value<Item, Multiple> = Multiple extends undefined | false
  ? // We assume the single item can always be null due to default values, user
    // clearing input, etc. This does not necessarily mean the value submitted
    // via this field is nullable. That type info is defined at the form
    // level not the field level and currently there is no connection.
    Nullable<Item>
  : readonly Item[];

export type FieldConfig<
  T,
  Multiple extends boolean | undefined = undefined,
  El extends HTMLElement = HTMLElement
> = Except<UseFieldConfig<Value<T, Multiple>>, 'multiple' | 'validate'> & {
  name: string;
  multiple?: Multiple;
  disabled?: boolean;
  required?: boolean;
  /**
   * One or more sync validators.
   * An async validator can also be given here.
   * Use {@link import('~/common').callSomeAsync callSomeAsync} to combine multiple.
   */
  validate?:
    | Many<Validator<Value<T, Multiple>> | null>
    | Validator<Value<T, Multiple>, true>;
  /**
   * An alternative to using isEqual which is given two items and makes you compare them.
   * This function is given one item and the value returned is used for comparison.
   * The comparison is an identity function, so an object should probably not be returned.
   *
   * Passing isEqual() ignores this completely.
   */
  compareBy?: (item: T) => any;
  autoFocus?: boolean;
  /** also do this on focus */
  onFocus?: (el: El) => void;
};

const emptyArray = [] as const;

export const useField = <
  T,
  Multiple extends boolean | undefined,
  El extends HTMLElement = HTMLElement
>({
  validate: validateProp = null,
  required = false,
  name: nameProp,
  disabled: disabledProp,
  onFocus: andDoOnFocus,
  defaultValue: defaultValueProp,
  isEqual: isEqualProp,
  multiple,
  compareBy,
  ...restConfig
}: FieldConfig<T, Multiple, El>) => {
  // If validate is given and an array compose it to a single function
  // Else default to the required validator if required is true.
  const validate = validateProp
    ? Array.isArray(validateProp)
      ? callSome(...many(validateProp))
      : validateProp
    : required
    ? ((multiple ? requiredArrayValidator : requiredValidator) as Validator<
        Value<T, Multiple>
      >)
    : undefined;

  const {
    afterSubmit,
    allowNull,
    beforeSubmit,
    format,
    formatOnBlur,
    initialValue,
    parse,
    subscription,
    type,
    validateFields,
    value,
    ...rest
  } = restConfig;

  const name = useFieldName(nameProp);

  const defaultValue =
    defaultValueProp ?? ((multiple ? emptyArray : null) as Value<T, Multiple>);

  const isEqual =
    isEqualProp ??
    (multiple
      ? isListEqualBy(compareBy ?? identity)
      : isEqualBy(compareBy ?? identity));

  const { input, meta } = useFinalField<
    Value<T, Multiple>,
    El,
    Value<T, Multiple>
  >(name, {
    // @ts-expect-error 2nd arg was made optional for unknown reasons.
    // Ignore this as FF always passes this value, so it's safe to use without checking for null.
    validate,
    multiple,
    ...restConfig,
    defaultValue,
    isEqual,
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

  const [focusInDoc, ref] = useFocus<El>(andDoOnFocus);
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
      defaultValue,
    },
    ref,
    rest,
  };
};
