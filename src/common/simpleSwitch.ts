export const simpleSwitch = <T, K extends string = string>(
  key: K,
  options: Record<K, T>
): T | undefined => options[key];
