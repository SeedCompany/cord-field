import type { IsUnknown, Primitive } from 'type-fest';
import type { IsPlainObject } from 'type-fest/source/internal';
import type { Scalars } from './schema/schema.graphql';

export * from './schema/enumLists';
export * from './schema/schema.graphql';

/**
 * Any of the GQL scalar types that are not primitives.
 */
export type NonPrimitiveScalar = Exclude<
  {
    [Scalar in keyof Scalars]: IsUnknown<Scalars[Scalar]['input']> extends true
    ? never
    : Scalars[Scalar]['input'];
  }[keyof Scalars],
  Primitive
>;

/**
 * Convert all non-primitive types to a specific type.
 * Mainly meant to prevent deep type mappings from traversing into non-primitive scalars and GQL references.
 */
export type CoerceNonPrimitives<Type, To = string> = Type extends
  | NonPrimitiveScalar
  | { __typename?: string }
  ? To
  : Type extends Primitive
    ? Type
    : Type extends ReadonlyArray<infer Item>
      ? ReadonlyArray<CoerceNonPrimitives<Item, To>>
      : IsPlainObject<Type> extends true
        ? Required<{
          [Key in keyof Type]: CoerceNonPrimitives<Type[Key] & {}, To>;
        }>
        : Type;
