import { Nil } from '@seedcompany/common';
import { ConditionalKeys } from 'type-fest';

interface Readable {
  canRead: boolean;
}

interface Editable {
  canEdit: boolean;
}

export interface SecuredProp<T> extends Readable, Editable {
  value?: T | Nil;
}

export type UnsecuredProp<T> = T extends Partial<SecuredProp<infer P>> ? P : T;

export const isSecured = <T>(value: unknown): value is SecuredProp<T> =>
  !!value &&
  typeof value === 'object' &&
  'canEdit' in value &&
  'canRead' in value;

export const unwrapSecured = <T>(value: T) =>
  (!!value &&
  typeof value === 'object' &&
  '__typename' in value &&
  typeof value.__typename === 'string' &&
  value.__typename.startsWith('Secured') &&
  'value' in value
    ? value.value
    : value) as T extends SecuredProp<infer U> ? U : T;

/**
 * Can the user read any of the fields of this object?
 * If no keys are specified all "secured" properties will be checked.
 * Otherwise only the keys provided will be checked.
 */
export const canReadAny = <T, K extends ConditionalKeys<T, Readable>>(
  obj: T | Nil,
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
  obj: T | Nil,
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
