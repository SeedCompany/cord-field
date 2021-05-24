/**
 * Create a function that checks for an object's typename, which narrows the
 * object to the given Type.
 *
 * To use specify the type to narrow to in the generic,
 * and give the name to check at runtime.
 * ```
 * isTypename<Type>('name')
 * ```
 *
 * This maybe most useful in array filter calls where TS doesn't do type
 * narrowing the same as if statements.
 * ```
 * // obj type is not narrowed here to only types with 'name' typename.
 * .filter((obj) => obj.__typename === 'name')
 * // It is here, but this is getting verbose
 * .filter((obj): obj is Type => obj.__typename === 'name')
 * // that's better
 * .filter(isTypename<Type>('name'))
 * ```
 */
export const isTypename =
  <Type extends { __typename?: string }>(
    name: Type extends { __typename?: infer Name } ? Name : never
  ) =>
  (obj: { __typename?: string }): obj is Type =>
    obj.__typename === name;
