import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TypedFormControl } from '../util';

/**
 * Validates a pair of fields based on the given validator,
 * else sets the error key given on both of the fields and the form.
 *
 * Optionally an assertion function can be given to validate the field value is a certain type (to prevent dev errors not user errors).
 */
export function validatePair<FieldValue = string>(
  fieldAName: string,
  fieldBName: string,
  errorKey: string,
  validator: (a: FieldValue, b: FieldValue) => boolean,
  assertFieldValue?: (value: any) => void
): ValidatorFn {
  return (control: AbstractControl) => {
    const a = getOrThrow<FieldValue>(control, fieldAName);
    const b = getOrThrow<FieldValue>(control, fieldBName);

    if (assertFieldValue) {
      assertFieldValue(a.value);
      assertFieldValue(b.value);
    }

    if (!a.value || !b.value || validator(a.value, b.value)) {
      // Remove error if it was previously set (below)
      removeError(a, errorKey);
      removeError(b, errorKey);

      return null;
    }

    // Set the errors on fields (not just the form)
    // This marks the field as invalid, so view states can know to not evaluate it
    // And to style the field as invalid (red label and line)
    addErrors(a, {[errorKey]: true});
    addErrors(b, {[errorKey]: true});

    // Mark both fields as touched so errors show up for both fields
    a.markAsTouched();
    b.markAsTouched();

    return {[errorKey]: true};
  };
}

export function getOrThrow<T = any>(form: AbstractControl, path: Array<string | number> | string): TypedFormControl<T | null> {
  const control = form.get(path) as TypedFormControl<T | null> | null;
  if (!control) {
    controlNotFound(Array.isArray(path) ? path.join('.') : path);
  }

  return control!;
}

export function controlNotFound(fieldName: string): never {
  throw new Error(`Form does not have control named: "${fieldName}".`);
}

export function addErrors(control: AbstractControl, errors: ValidationErrors): void {
  control.setErrors({...control.errors, ...errors});
}

export function removeError(control: AbstractControl, errorName: string): void {
  if (!control.hasError(errorName)) {
    return;
  }
  const {[errorName]: error = null, ...otherErrors} = control.errors!;
  control.setErrors(Object.keys(otherErrors).length > 0 ? otherErrors : null);
}
