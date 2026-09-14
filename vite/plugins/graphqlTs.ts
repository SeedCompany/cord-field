import type { Plugin } from 'vite';

/**
 * Our GraphQL documents are imported by their `.graphql` path, but the thing
 * actually loaded is the `.graphql.ts` file that codegen writes next to it.
 *
 * Under Razzle this was a Jest `moduleNameMapper` entry plus a webpack
 * resolver; here it is a single resolver plugin shared by the app build and
 * the test runner.
 */
export const graphqlTs = (): Plugin => ({
  name: 'cord-field:graphql-ts',
  // Must beat Vite's own resolver, which would try to read the `.graphql` file.
  enforce: 'pre',
  async resolveId(source, importer, options) {
    if (!source.endsWith('.graphql')) {
      return null;
    }
    // Delegate so aliases (`~/…`) and extension resolution still apply.
    const resolved = await this.resolve(`${source}.ts`, importer, {
      ...options,
      skipSelf: true,
    });
    return resolved ?? null;
  },
});
