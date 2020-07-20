import isPlainObject from 'is-plain-object';
import { ConditionalKeys } from 'type-fest';
import { Nullable } from '../util';
import { Editable, Readable } from './schema.generated';

export interface Secured<T> extends Readable, Editable {
  value?: Nullable<T>;
}

export const isSecured = <T>(value: unknown): value is Secured<T> =>
  value &&
  isPlainObject(value) &&
  'canEdit' in (value as any) &&
  'canRead' in (value as any);

/**
 * Can the user read any of the fields of this object?
 * If no keys are specified all "secured" properties will be checked.
 * Otherwise only the keys provided will be checked.
 */
export const canReadAny = <T, K extends ConditionalKeys<T, Readable>>(
  obj: Nullable<T>,
  ...keys: K[]
) => {
  if (!obj) {
    return false;
  }
  if (keys.length === 0) {
    keys = (Object.keys(obj) as K[]).filter((key) => isSecured(obj[key]));
  }
  return keys.some((key) => (obj[key] as Readable).canRead);
};

/**
 * Can the user edit any of the fields of this object?
 * If no keys are specified all "secured" properties will be checked.
 * Otherwise only the keys provided will be checked.
 */
export const canEditAny = <T, K extends ConditionalKeys<T, Editable>>(
  obj: Nullable<T>,
  ...keys: K[]
) => {
  if (!obj) {
    return false;
  }
  if (keys.length === 0) {
    keys = (Object.keys(obj) as K[]).filter((key) => isSecured(obj[key]));
  }
  return keys.some((key) => (obj[key] as Editable).canEdit);
};
