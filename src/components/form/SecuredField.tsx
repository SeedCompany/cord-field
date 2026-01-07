import { ReactElement } from 'react';
import { GqlObject, GqlTypeOf } from '~/api';
import { Nullable, SecuredProp } from '~/common';

export interface SecuredFieldRenderProps<Name extends string = string> {
  name: Name;
  disabled?: boolean;
}

export type ChangesOf<T extends GqlObject> = T extends unknown
  ? {
      [K in keyof GqlTypeOf<T> &
        keyof T &
        string as GqlTypeOf<T>[K] extends SecuredProp<any>
        ? K
        : never]?: Unsecure<GqlTypeOf<T>[K]>;
    }
  : never;

type Unsecure<T> = T extends SecuredProp<infer U>
  ? U extends { id: string }
    ? string
    : U
  : T;

type DistributedKeyOf<T> = T extends unknown ? keyof T & string : never;

export type SecuredEditableKeys<T extends GqlObject> = DistributedKeyOf<
  ChangesOf<T>
>;

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
    // @ts-expect-error We confirm this below
    const field: SecuredProp<any> = obj[name];
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
