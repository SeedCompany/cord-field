import { FieldState } from 'final-form';
import { Promisable } from 'type-fest';
import isEmail from 'validator/lib/isEmail';

/**
 * A little stricter than upstream with the return type
 */
export type Validator<Value> = (
  value: Value,
  allValues: object,
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

export const email = (value: string) =>
  !value || isEmail(value) ? undefined : 'Invalid email';
