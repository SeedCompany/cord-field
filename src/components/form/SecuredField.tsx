import { ReactElement } from 'react';
import { ConditionalKeys } from 'type-fest';
import { Secured } from '../../api';
import { Nullable } from '../../util';

export interface SecuredFieldRenderProps<Name extends string = string> {
  name: Name;
  disabled?: boolean;
}

export type SecuredKeys<T> = Extract<ConditionalKeys<T, Secured<any>>, string>;

/**
 * An experimental way to render a form field of a secured property.
 * @experimental
 */
export const SecuredField = <T, K extends SecuredKeys<T>>({
  obj,
  name,
  children,
}: {
  obj: Nullable<T>;
  name: K;
  children: (props: SecuredFieldRenderProps<K>) => ReactElement;
}) => {
  const field = obj?.[name] as Nullable<Secured<any>>;
  if (field && !field.canRead) {
    return null;
  }
  return children({
    name,
    disabled: obj ? !field?.canEdit : undefined,
  });
};
