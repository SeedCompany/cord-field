import { Nullable } from '../util';

export interface Secured<T> {
  canRead: boolean;
  canEdit: boolean;
  value?: Nullable<T>;
}
