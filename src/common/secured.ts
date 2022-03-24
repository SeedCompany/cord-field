import { isPlainObject } from 'lodash';
import { ConditionalKeys } from 'type-fest';
import { has, Nullable } from '../util';

interface Readable {
  canRead: boolean;
}

interface Editable {
  canEdit: boolean;
}

export interface SecuredProp<T> extends Readable, Editable {
  value?: Nullable<T>;
}

export type UnsecuredProp<T> = T extends Partial<SecuredProp<infer P>> ? P : T;

export const isSecured = <T>(value: unknown): value is SecuredProp<T> =>
  Boolean(value) &&
  isPlainObject(value) &&
  'canEdit' in (value as any) &&
  'canRead' in (value as any);

export const unwrapSecured = (value: unknown): unknown =>
  isPlainObject(value) &&
  has('__typename', value) &&
  typeof value.__typename === 'string' &&
  value.__typename.startsWith('Secured') &&
  has('value', value)
    ? value.value
    : value;

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
  return keys.some((key) => (obj[key] as unknown as Readable).canRead);
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
  return keys.some((key) => (obj[key] as unknown as Editable).canEdit);
};
