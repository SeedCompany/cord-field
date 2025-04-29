import { Scalars } from '../../schema.graphql';

export const Parsers: {
  [K in keyof Scalars]?: (val: any) => Scalars[K]['output'];
} = {};

export const optional =
  <T, R>(parser?: (val: T) => R) =>
  (val: T | null | undefined): R | null =>
    val != null ? parser?.(val) ?? (val as unknown as R) : null;
