import { Reference } from '@apollo/client';
import { Simplify } from 'type-fest';
import { GqlTypeMap } from './typeMap';

export interface GqlObject {
  __typename?: keyof GqlTypeMap;
}

export interface Entity extends GqlObject {
  id: string;
}

// With an actual type from an operation, convert it to a schema type
export type GqlTypeOf<T extends GqlObject> = GqlTypeMap[TypeName<T>];

export type TypeName<T extends GqlObject> = T extends { __typename?: infer N }
  ? N
  : never;

/**
 * Apollo cache allows references to be passed instead of values.
 * This helps describe that the object to store can be shaped in both of these ways.
 */
export type Storable<T> = {
  [K in keyof T]: StorableVal<T[K]>;
};

type StorableVal<T> = T extends ReadonlyArray<infer U>
  ? ReadonlyArray<U extends Reference ? Reference : Storable<U> | Reference>
  : T extends Reference
  ? Reference
  : Storable<T> | Reference;

/**
 * A type compat with an operation that has no vars.
 */
export type NoVars = Simplify<Record<string, never>>;
