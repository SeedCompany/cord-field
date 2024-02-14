import { ReactElement } from 'react';
import { GqlObject, GqlTypeOf } from '~/api';
import { Nullable, SecuredProp } from '~/common';

export interface SecuredFieldRenderProps<Name extends string = string> {
  name: Name;
  disabled?: boolean;
}

export type ChangesOf<T extends GqlObject> = {
  [K in keyof GqlTypeOf<T> &
    keyof T &
    string as GqlTypeOf<T>[K] extends SecuredRelation
    ? `${K}Id`
    : GqlTypeOf<T>[K] extends SecuredProp<any>
    ? K
    : never]?: Unsecure<GqlTypeOf<T>[K]>;
};

type Unsecure<T> = T extends SecuredProp<infer U>
  ? U extends { id: string }
    ? string
    : U
  : T;
type SecuredRelation = SecuredProp<{ id: string }>;

export type SecuredEditableKeys<T extends GqlObject> = [
  keyof ChangesOf<T>
] extends [never]
  ? string
  : keyof ChangesOf<T> & string;

/**
 * An experimental way to render a form field of a secured property.
 * @experimental
 */
export const SecuredField = <
  T extends GqlObject,
  K extends SecuredEditableKeys<T>
>({
  obj,
  name,
  children,
}: {
  obj: Nullable<T>;
  name: K;
  children: (props: SecuredFieldRenderProps<K>) => ReactElement;
}) => {
  // Allow reading & editing when creating new object
  let canEdit = true;
  let canRead = true;
  if (obj) {
    // @ts-expect-error Grab key from object following naming convention. We check below that we grabbed it correctly.
    const field: SecuredProp<any> = obj[name] ?? obj[name.replace(/Id$/, '')];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- sanity check since we ignored types above
    if (field === undefined || field.canRead == null || field.canEdit == null) {
      console.error(
        `Cannot determine if field should be readable/editable: ${obj.__typename}.${name}`
      );
      return null;
    }
    canRead = field.canRead;
    canEdit = field.canEdit;
  }
  if (!canRead) {
    return null;
  }
  return children({
    name,
    ...(!canEdit ? { disabled: true } : {}),
  });
};
