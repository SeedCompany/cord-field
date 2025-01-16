import type { Simplify } from 'type-fest';

/**
 * type-fest's former Merge,
 * which now it tries to handle index properties
 * and breaks other use cases for us.
 *
 * This is more accurate than what TS does for spreads: `A & B`
 */
type Merge<Defaults, Overrides> = Simplify<
  {
    [Key in keyof Defaults as Key extends keyof Overrides
      ? never
      : Key]: Defaults[Key];
  } & Overrides
>;

export const merge = <const Defaults, const Overrides>(
  defaults: Defaults,
  overrides: Overrides
): Merge<Defaults, Overrides> => ({
  ...defaults,
  ...overrides,
});
