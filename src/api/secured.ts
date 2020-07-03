import isPlainObject from 'is-plain-object';
import { Nullable } from '../util';

export interface Secured<T> {
  canRead: boolean;
  canEdit: boolean;
  value?: Nullable<T>;
}

export const isSecured = <T>(value: unknown): value is Secured<T> =>
  value &&
  isPlainObject(value) &&
  'canEdit' in (value as any) &&
  'canRead' in (value as any);
