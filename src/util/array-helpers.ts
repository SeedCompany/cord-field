export type Many<T> = T | readonly T[];

export const many = <T>(items: Many<T>): readonly T[] =>
  Array.isArray(items) ? items : [items];
