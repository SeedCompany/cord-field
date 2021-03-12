import isPlainObject from 'is-plain-object';
import { ConditionalKeys } from 'type-fest';
import { Nullable } from '../util';

interface Readable {
  canRead: boolean;
}

interface Editable {
  canEdit: boolean;
}

export interface SecuredProp<T> extends Readable, Editable {
  value?: Nullable<T>;
}

export const isSecured = <T>(value: unknown): value is SecuredProp<T> =>
  Boolean(value) &&
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
  defaultValue = false,
  ...keys: K[]
) => {
  if (!obj) {
    return defaultValue;
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
  defaultValue = false,
  ...keys: K[]
) => {
  if (!obj) {
    return defaultValue;
  }
  if (keys.length === 0) {
    keys = (Object.keys(obj) as K[]).filter((key) => isSecured(obj[key]));
  }
  return keys.some((key) => (obj[key] as Editable).canEdit);
};
