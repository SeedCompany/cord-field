import { ReactNode } from 'react';
import { Simplify } from 'type-fest';

export type Nullable<T> = T | null | undefined;

export type ExtractStrict<T, U extends T> = T extends U ? T : never;

/**
 * A shortcut to use with component's props.
 */
export interface ChildrenProp {
  children?: ReactNode | undefined;
}

/**
 * Like type-fest's former Merge,
 * but now it tries to handle index properties
 * which breaks other use cases.
 */
export type Merge<Destination, Source> = Simplify<
  {
    [Key in keyof Destination as Key extends keyof Source
      ? never
      : Key]: Destination[Key];
  } & Source
>;
