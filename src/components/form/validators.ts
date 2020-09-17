import { FieldState } from 'final-form';
import { Promisable } from 'type-fest';
import isEmail from 'validator/lib/isEmail';

/**
 * A little stricter than upstream with the return type
 */
export type Validator<Value> = (
  value: Value,
  allValues: Record<string, any>,
  meta?: FieldState<Value>
) => Promisable<string | undefined>;

// Compose multiple validators. Order matters.
export const compose = <Value>(
  ...validators: Array<Validator<Value>>
): Validator<Value> => (value: any, allValues: any) => {
  for (const validator of validators) {
    const result = validator(value, allValues);
    if (result) {
      return result;
    }
  }

  return undefined;
};

export const required = (value: unknown) => (value ? undefined : 'Required');

// setting null or undefined for value on Autocomplete {multiple} doesn't work, so use []
export const requiredArray = <T>(value: readonly T[]) =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  value?.length > 0 ? undefined : 'Required';

export const email = (value: string) =>
  !value || isEmail(value) ? undefined : 'Invalid email';

export const min = (min: number, error?: string) => (
  val: number | null | undefined
) => (val != null && val < min ? error ?? 'Value is below minimum' : undefined);

export const max = (max: number, error?: string) => (
  val: number | null | undefined
) => (val != null && val > max ? error ?? 'Value is above maximum' : undefined);

export const minLength = (min = 2) => (value: string) =>
  !value || value.length >= min
    ? undefined
    : `Must be ${min} or more characters`;
