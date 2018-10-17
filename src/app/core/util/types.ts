/**
 * Given T, return a sub type with only the properties that match the given condition.
 *
 * Example:
 * ```
 *   interface Foo {
 *     a: {id: string, color: 'red'};
 *     b: {id: string, color: 'blue'};
 *     c: boolean;
 *   }
 *   PickWithType<Foo, {id: string}>; == {
 *     a: {id: string, color: 'red'};
 *     b: {id: string, color: 'blue'};
*    }
 * ```
 * Note that properties match the condition given but are not limited to them.
 * `a` and `b` both have their different color properties.
 */
export type PickWithType<T, Condition> = Pick<T, ExtractKeys<T, Condition>>;

/**
 * Given T, return a record with only the properties that match the given condition and their values as the condition.
 *
 * Example:
 * ```
 *   interface Foo {
 *     a: {id: string, color: 'red'};
 *     b: {id: string, color: 'blue'};
 *     c: boolean;
 *   }
 *   RecordOfType<Foo, {id: string}>; == {
 *     a: {id: string};
 *     b: {id: string};
 *  }
 * ```
 * Note that properties match and are limited to the condition given.
 * `a` and `b` both have their color properties excluded.
 */
export type RecordOfType<T, Condition> = Record<ExtractKeys<T, Condition>, Condition>;

/**
 * Extracts keys of T that match the condition given.
 *
 * Example:
 * ```
 *   interface Foo {
 *     a: string;
 *     b: string;
 *     c: boolean;
 *   }
 *   ExtractKeys<Foo, string> == 'a' | 'b
 * ```
 */
export type ExtractKeys<T, Condition> = {
  [Key in keyof T]: T[Key] extends Condition ? Key : never
}[keyof T];

/**
 * Remove properties `K` from `T`.
 */
export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export type OneOrMore<T> = T | T[];
