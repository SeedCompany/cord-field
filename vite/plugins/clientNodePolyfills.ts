import type { Plugin, PluginOption } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

type NodePolyfillsOptions = Parameters<typeof nodePolyfills>[0];

const PLUGIN = 'vite-plugin-node-polyfills';

/**
 * `vite-plugin-node-polyfills`, confined to the client module graph.
 *
 * The plugin contributes its browser shims as **global** `resolve.alias`
 * entries. `resolve.alias` has no per-environment form (Vite's
 * `EnvironmentResolveOptions` has no `alias`) and Vite's own alias plugin runs
 * ahead of every user plugin, `enforce: 'pre'` included — so in dev, where one
 * resolver serves both module graphs, those aliases hit the SSR graph too. The
 * concrete failure: `import * as path from 'path'` in `src/server/server.ts`
 * resolves to `path-browserify`, a CommonJS file, and the dev server dies with
 * `module is not defined` before Express is ever constructed.
 *
 * `vite build` never sees this — `vite.config.ts` leaves the plugin out of the
 * SSR build entirely — so the collision is a dev-only artifact of the two
 * graphs sharing one resolver.
 *
 * Its `transform` hook leaks the same way, and worse. `globals.process: true`
 * makes it rewrite bare `process` references to its browser shim — in the SSR
 * graph too, where `process` is real. The shim's `env` is an empty object, so
 * `renderServerSideApp`'s `clientEnv` came out as `{"PUBLIC_URL":"/"}`: no
 * `NODE_ENV`, no `RAZZLE_API_BASE_URL`, and every GraphQL call in dev pointed
 * at the wrong host. Silent, and exactly the failure `loadDotenv` was added to
 * prevent.
 *
 * So: take the plugin at its word about *what* to polyfill and change *where*
 * it applies. `applyToEnvironment` is the supported per-environment gate and
 * covers every hook the plugin has — except `config`, which is global by
 * nature, so the alias map it contributes is lifted out and re-applied as a
 * client-gated `resolveId` instead. A user `enforce: 'pre'` plugin still runs
 * before `vite:resolve`, so client resolution is unchanged. The `optimizeDeps`
 * esbuild shims it also contributes are client-only already.
 */
export const clientNodePolyfills = (
  options: NodePolyfillsOptions
): PluginOption[] => {
  const plugins = nodePolyfills(options) as unknown as Plugin[];

  const main = plugins.find((plugin) => plugin.name === PLUGIN);
  if (typeof main?.config !== 'function') {
    throw new Error(
      `${PLUGIN} no longer contributes its aliases from a \`config\` function; ` +
        'clientNodePolyfills needs updating.'
    );
  }

  /** Filled in when the wrapped `config` hook below runs, before resolution. */
  let aliases: Record<string, string> = {};

  const contributeConfig = main.config;
  main.config = function (...args) {
    const contributed = contributeConfig.apply(this, args) as
      | { resolve?: { alias?: Record<string, string> } }
      | null
      | undefined;
    const alias = contributed?.resolve?.alias;
    if (!alias) {
      throw new Error(
        `${PLUGIN} contributed no \`resolve.alias\`; clientNodePolyfills needs updating.`
      );
    }
    aliases = alias;
    // `resolve` holds nothing else, so drop the whole key rather than leaving
    // an empty object for Vite to merge.
    delete contributed.resolve;
    return contributed;
  };

  const clientOnly = (environment: { name: string }) =>
    environment.name === 'client';

  return [
    {
      name: 'cord-field:client-node-polyfills',
      // Before `vite:resolve`, which is where the alias entries would have
      // been consulted. Vite's built-in alias plugin sorts ahead of this, but
      // it now has nothing of ours to match.
      enforce: 'pre',
      applyToEnvironment: clientOnly,
      async resolveId(source, importer, resolveOptions) {
        const replacement = aliases[source];
        if (!replacement) {
          return null;
        }
        // Delegate so the shim is resolved exactly as an alias replacement
        // would have been (package `exports`, extensions, optimized deps).
        return await this.resolve(replacement, importer, {
          ...resolveOptions,
          skipSelf: true,
        });
      },
    },
    // The plugin's own hooks — the trailing-slash resolver and, critically,
    // the `process`/`Buffer`/`global` injecting transform — gated the same way.
    ...plugins.map((plugin) => ({ ...plugin, applyToEnvironment: clientOnly })),
  ];
};
