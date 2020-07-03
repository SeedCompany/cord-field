import { ReactElement } from 'react';
import { ConditionalKeys } from 'type-fest';
import { Secured } from '../../api';
import { Nullable } from '../../util';

interface SecuredFieldRenderProps {
  name: string;
  disabled?: boolean;
}

/**
 * An experimental way to render a form field of a secured property.
 * @experimental
 */
export const SecuredField = <T, K extends ConditionalKeys<T, Secured<any>>>({
  obj,
  name,
  children,
}: {
  obj: Nullable<T>;
  name: K;
  children: (props: SecuredFieldRenderProps) => ReactElement;
}) => {
  const field = obj?.[name] as Nullable<Secured<any>>;
  if (field && !field.canRead) {
    return null;
  }
  return children({
    name: name as string,
    disabled: obj ? !field?.canEdit : undefined,
  });
};
