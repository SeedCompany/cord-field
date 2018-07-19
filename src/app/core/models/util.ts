import { AsyncValidatorFn, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { AbstractControlOptions } from '@angular/forms/src/model';
import { Observable } from 'rxjs/Observable';

export const REDACTED = '🙈';

export function maybeRedacted<T = string>(value: T | null | undefined): T | null {
  return ((typeof value === 'string' && value === REDACTED) || value === undefined) ? null : value;
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

export function generateObjectId(): string {
  // tslint:disable:no-bitwise
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'
    .replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16))
    .toLowerCase();
  // tslint:enable:no-bitwise
}

export function firstLettersOfWords(words: string, limit = 3): string {
  // https://regex101.com/r/63P0Hw
  return (words.match(/\b([\p{Lu}\p{N}])/gu) || []).join('').substr(0, limit);
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

// Shortcut for a mapping of keys of object {T} to values {V}
export type ObjMap<T, V> = {[key in keyof T]: V};

/**
 * A helper to map object values by their key/values via a mapper function
 *
 * mapEntries(obj, (key, value) => value + 1)
 */
export function mapEntries<T extends ObjMap<T, V>, V, U>(obj: T, mapper: (key: keyof T, value: V) => U): ObjMap<T, U> {
  const mapped = {} as ObjMap<T, U>;

  for (const [key, value] of Object.entries(obj) as Array<[keyof T, V]>) {
    mapped[key] = mapper(key, value);
  }

  return mapped;
}

export function sortBy<T>(iteratee: (item: T) => any, order: 'asc' | 'desc' = 'asc') {
  return (a: T, b: T) => {
    const sortA = iteratee(a);
    const sortB = iteratee(b);

    if (sortA < sortB) {
      return order === 'asc' ? -1 : 1;
    }
    if (sortA > sortB) {
      return order === 'asc' ? 1 : -1;
    }

    return 0;
  };
}

/**
 * An RXJs pipeable operator that filters form values to only ones that are valid.
 */
export const onlyValidValues = <T>(form: FormGroup) => (source: Observable<T>): Observable<Partial<T>> => {
  return source.map(values => filterEntries<Partial<T>>(values, key => form.get(key)!.valid));
};
