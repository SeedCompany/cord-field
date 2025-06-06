import { isObjectLike, Nil } from '@seedcompany/common';
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

/**
 * @deprecated unsafely assumes canRead/Edit
 */
export const unwrapSecured = <T>(value: T) =>
  (isObjectLike(value) &&
  hasTypename(value) &&
  value.__typename.startsWith('Secured') &&
  'value' in value
    ? value.value
    : value) as T extends SecuredProp<infer U> ? U : T;

export const unwrapSecuredEdge = <T>(
  value: T
): T extends { __typename: `Secured${string}` }
  ? T extends { value: infer U }
    ? U
    : T extends { items: infer U }
    ? U
    : T
  : T => {
  if (
    isObjectLike(value) &&
    hasTypename(value) &&
    value.__typename.startsWith('Secured')
  ) {
    return 'value' in value
      ? value.value
      : 'items' in value && Array.isArray(value.items)
      ? value.items
      : (value as any);
  }
  return value as any;
};

const hasTypename = (value: object): value is { __typename: string } =>
  '__typename' in value && typeof value.__typename === 'string';

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
