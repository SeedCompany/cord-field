import { AsyncValidatorFn, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { AbstractControlOptions } from '@angular/forms/src/model';
import { Observable } from 'rxjs/Observable';

export const REDACTED = '🙈';

export function maybeRedacted(value: string | null | undefined): string | null {
  return (value === REDACTED || value === undefined) ? null : value;
}

export class TypedFormControl<T> extends FormControl {
  constructor(
    formState?: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(formState, validatorOrOpts);
  }

  readonly value: T;

  setValue(value: T, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }): void {
    super.setValue(value, options);
  }

  patchValue(value: T, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }): void {
    super.patchValue(value, options);
  }

  reset(formState?: T | {value: T, disabled: boolean}, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void {
    super.reset(formState, options);
  }
}

export function clone<T>(obj: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}

/**
 * A helper to filter objects by their key/values via a predicate function
 *
 *   filterEntries(obj, (key, value) => value.keep == true);
 */
export function filterEntries<T>(obj: T, predicate: (key: keyof T, value: T[keyof T]) => boolean): T {
  const filtered: any = {};

  for (const [key, value] of Object.entries(obj) as [keyof T, any]) {
    if (predicate(key, value)) {
      filtered[key] = value;
    }
  }

  return filtered;
}

/**
 * An RXJs pipeable operator that filters form values to only ones that are valid.
 */
export const onlyValidValues = <T>(form: FormGroup) => (source: Observable<T>): Observable<Partial<T>> => {
  return source.map(values => filterEntries<Partial<T>>(values, key => form.get(key)!.valid));
};
