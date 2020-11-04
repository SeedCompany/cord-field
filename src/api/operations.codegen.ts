import { plugin as basePlugin } from '@graphql-codegen/named-operations-object';
import type { PluginFunction } from '@graphql-codegen/plugin-helpers/types';

export const plugin: PluginFunction = async (...args) => {
  const result = await basePlugin(...args);
  return result ? result + ' as const' : result;
};
