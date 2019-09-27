import { Nullable } from './types';

export const ifValue = <T, R, Default = undefined>(value: Nullable<T>, doWith: (val: T) => R, defaultVal?: Default): R | Default =>
  ifValueFn(doWith, defaultVal)(value);

export const ifValueFn = <T, R, Default = undefined>(doWith: (val: T) => R, defaultVal?: Default) =>
  (value: Nullable<T>): R | Default => hasValue(value) ? doWith(value) : (defaultVal as Default);

/**
 * Booleans, numbers, non-empty arrays, and non-empty strings return true.
 */
export function hasValue<T>(value: T | null | undefined): value is T;
export function hasValue(value: unknown): boolean {
  if (typeof value === 'boolean' || typeof value === 'number') {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return Boolean(value);
}
