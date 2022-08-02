import { ReactNode } from 'react';

export type Nullable<T> = T | null | undefined;

export type ExtractStrict<T, U extends T> = T extends U ? T : never;

/**
 * A shortcut to use with component's props.
 */
export interface ChildrenProp {
  children?: ReactNode | undefined;
}
