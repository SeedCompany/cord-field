export * from './array-helpers';
export * from './CalenderDate';
export * from './log';
export * from './sleep';
export * from './styles';
export * from './types';
export * from './use-styles.types';
export * from './compose-fns';
export * from './isTypename';

export const simpleSwitch = <T, K extends string = string>(
  key: K,
  options: Record<K, T>
): T | undefined => options[key];
