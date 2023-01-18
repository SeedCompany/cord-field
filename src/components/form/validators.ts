import { FieldState } from 'final-form';
import { Promisable } from 'type-fest';
import isEmail from 'validator/lib/isEmail';
import { Nullable } from '~/common';

/**
 * A little stricter than upstream with the return type
 */
export type Validator<Value, Async extends boolean | undefined = undefined> = (
  value: Value,
  allValues: Record<string, any>,
  meta?: FieldState<Value>
) => Async extends true ? Promisable<string | undefined> : string | undefined;

export const required = (value: unknown) => (value ? undefined : 'Required');

export const requiredArray = <T>(value: Nullable<readonly T[]>) =>
  value && value.length > 0 ? undefined : 'Required';

export const email = (value: Nullable<string>) =>
  !value || isEmail(value) ? undefined : 'Invalid email';

export const min =
  (min: number, error?: string) => (val: number | null | undefined) =>
    val != null && val < min
      ? error ?? `Choose value at or above ${min}`
      : undefined;

export const max =
  (max: number, error?: string) => (val: number | null | undefined) =>
    val != null && val > max
      ? error ?? `Choose value at or below ${max}`
      : undefined;

export const minLength =
  (min = 2) =>
  (value: Nullable<string>) =>
    !value || value.length >= min
      ? undefined
      : `Must be ${min} or more characters`;

export const isLength = (len: number) => (value: Nullable<string>) =>
  !value || value.length === len ? undefined : `Must be ${len} characters`;

export const isAlpha = (value: string) =>
  !value || /^[A-Za-z]+$/.exec(value)
    ? undefined
    : `Must be only be alpha characters`;
