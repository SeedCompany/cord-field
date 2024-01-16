export const lowerCase = <T extends string>(str: T) =>
  str.toLowerCase() as Lowercase<T>;
export const upperCase = <T extends string>(str: T) =>
  str.toUpperCase() as Uppercase<T>;
