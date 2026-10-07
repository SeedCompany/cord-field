import LoadablePlugin from '@loadable/webpack-plugin';
import {
  defineConfig,
  type RsbuildConfig,
  rspack,
  type Rspack,
} from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { loadEnvFiles } from './config/loadEnvFiles.cjs';
import { pluginStartServer } from './config/pluginStartServer';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.resolve(rootDir, 'build');

// Read at runtime in production builds, instead of inlined at build time.
const runtimeEnvKeys = new Set([
  'HOST',
  'PORT',
  'PUBLIC_URL',
  'RAZZLE_API_BASE_URL',
]);

/**
 * Creates DefinePlugin entries for `RAZZLE_*` env vars, the same way Razzle did.
 *
 * In dev every key is inlined. In production, `runtimeEnvKeys` are left for runtime.
 */
function razzleEnvDefines(isDevServer: boolean) {
  const buildEnv: Record<string, string> = {
    PORT: process.env.PORT || '3000',
    HOST: process.env.HOST || 'localhost',
  };
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('RAZZLE_') && value !== undefined) {
      buildEnv[key] = value;
    }
  }
  return Object.fromEntries(
    Object.entries(buildEnv)
      .filter(([key]) => isDevServer || !runtimeEnvKeys.has(key))
      .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
  );
}

/**
 * Leaves `node_modules` imports to `require()` at runtime in the server bundle.
 *
 * Only externalizes requests that resolve the same from the project root,
 * since only those can be required from `build/server.js` (matches Razzle).
 */
async function externalizeNodeModules({
  request,
  context,
  getResolve,
}: Rspack.ExternalItemFunctionData) {
  const isLocalRequest =
    request?.startsWith('.') || path.isAbsolute(request ?? '');
  // SWC injects helper imports that the app doesn't depend on directly
  const isSwcHelper = request?.startsWith('@swc/helpers');
  if (!request || !context || !getResolve || isLocalRequest || isSwcHelper) {
    return undefined;
  }
  const resolveRequest = getResolve();
  const tryResolve = (fromDir: string) =>
    resolveRequest(fromDir, request).catch(() => undefined);
  const resolvedPath = await tryResolve(context);
  if (!resolvedPath || !/node_modules[/\\].*\.[cm]?js$/.test(resolvedPath)) {
    return undefined;
  }
  const rootResolvedPath = await tryResolve(rootDir);
  return rootResolvedPath === resolvedPath ? `commonjs ${request}` : undefined;
}

// eslint-disable-next-line import/no-default-export
export default defineConfig(({ env, command }) => {
  // Razzle's `env.dev`: running the dev server, not a build
  const isDevServer = command === 'dev';
  // Razzle's `IS_DEV_ENV`: builds can run in development mode too
  const isDevMode = env === 'development';
  loadEnvFiles(env, rootDir);
  if (command === 'build' || command === 'dev') {
    // Both environments write into `build`, so clean it once up front.
    fs.rmSync(buildDir, { recursive: true, force: true });
  }

  // Browser only talks to one port in dev. The dev server proxies everything
  // except its own assets to the SSR server, which listens on the next port.
  const port = Number(process.env.PORT || 3000);
  const serverPort = isDevServer ? port + 1 : port;

  const sharedDefines = {
    ...razzleEnvDefines(isDevServer),
    'process.env.MUI_X_LICENSE_KEY': JSON.stringify(
      process.env.MUI_X_LICENSE_KEY
    ),
    // https://github.com/apollographql/apollo-client/pull/8347
    ...(isDevServer ? {} : { __DEV__: 'false' }),
  };

  const webEnvironment: RsbuildConfig = {
    source: {
      entry: { client: './src/client.tsx' },
      // Load chunks from the runtime PUBLIC_URL
      preEntry: isDevServer ? [] : ['./src/setPublicPath.ts'],
      define: {
        // The SSR html provides `window.env` from the runtime app env config
        'process.env': 'window.env',
        ...sharedDefines,
      },
    },
    output: {
      target: 'web',
      distPath: {
        root: 'build/public',
        jsAsync: 'static/js',
        cssAsync: 'static/css',
        image: 'static/media',
        svg: 'static/media',
        font: 'static/media',
      },
      filename: isDevServer
        ? { js: '[name].js', css: '[name].css' }
        : {
            js: '[name].[contenthash:8].js',
            css: '[name].[contenthash:8].css',
          },
    },
    plugins: [pluginNodePolyfill()],
    tools: {
      htmlPlugin: false,
      rspack: {
        output: {
          chunkFilename: isDevServer
            ? 'static/js/[name].chunk.js'
            : 'static/js/[name].[contenthash:8].chunk.js',
        },
        plugins: [
          new LoadablePlugin({
            outputAsset: false,
            writeToDisk: { filename: buildDir },
          }),
          process.env.BUNDLE_ANALYZE &&
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              reportFilename: 'report.html',
            }),
        ],
      },
    },
  };

  const nodeEnvironment: RsbuildConfig = {
    source: {
      entry: { server: './src/index.ts' },
      define: {
        ...sharedDefines,
        'process.env.LOADABLE_STATS_MANIFEST': isDevServer
          ? `require('path').resolve('build/loadable-stats.json')`
          : `__dirname + '/loadable-stats.json'`,
        // Only a single port is used in production
        ...(isDevServer
          ? {}
          : { 'process.env.SERVER_PORT': 'process.env.PORT' }),
      },
    },
    output: {
      target: 'node',
      // CommonJS, like Razzle. The server relies on `__dirname` & `require`.
      module: false,
      minify: true,
      distPath: { root: 'build', js: '', jsAsync: '' },
      filename: { js: '[name].js' },
      filenameHash: false,
      externals: [externalizeNodeModules],
      emitAssets: false,
    },
    dev: {
      hmr: false,
      writeToDisk: true,
    },
    tools: {
      rspack: {
        node: { __dirname: false, __filename: false },
        output: { chunkFilename: '[name].chunk.js' },
        plugins: [
          !isDevServer &&
            !isDevMode &&
            new rspack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
          // Webpack doesn't always get the init order right for cycles
          // when compiling to a single file for the server.
          !isDevServer &&
            new rspack.CircularDependencyRspackPlugin({
              exclude: /node_modules|src[/\\]components[/\\]files/,
              failOnError: true,
            }),
        ],
      },
    },
  };

  return {
    plugins: [
      pluginReact({
        swcReactOptions: { importSource: '@emotion/react' },
      }),
      pluginBabel({
        include: path.resolve(rootDir, 'src'),
        babelLoaderOptions(_options, { addPlugins }) {
          addPlugins([
            [
              'transform-rename-import',
              {
                replacements: [
                  { original: '(.+)\\.graphql$', replacement: '$1.graphql.ts' },
                ],
              },
            ],
            '@emotion/babel-plugin',
            './src/server/disableSsrByDefault',
            '@loadable/babel-plugin',
            /* eslint-disable no-template-curly-in-string */
            [
              'babel-plugin-transform-imports',
              {
                lodash: { transform: 'lodash/${member}' },
                '@mui/icons-material': {
                  transform: '@mui/icons-material/${member}',
                },
                '@mui/material': { transform: '@mui/material/${member}' },
                '@mui/lab': { transform: '@mui/lab/${member}' },
              },
            ],
            /* eslint-enable no-template-curly-in-string */
          ]);
        },
      }),
      pluginStartServer({
        environmentName: 'node',
        serverScript: path.resolve(rootDir, 'build/server.js'),
        serverPort,
      }),
    ],
    resolve: {
      alias: {
        // react-dnd imports this, but React 18.2's `exports` map omits it.
        'react/jsx-runtime.js': 'react/jsx-runtime',
      },
    },
    environments: {
      web: webEnvironment,
      node: nodeEnvironment,
    },
    // Match Razzle: no shared vendor chunks, only explicit async chunks
    splitChunks: {
      preset: 'none',
      cacheGroups: { default: false, defaultVendors: false },
    },
    output: {
      cleanDistPath: false,
      sourceMap: {
        js: isDevServer || isDevMode ? 'cheap-module-source-map' : 'source-map',
      },
    },
    performance: {
      buildCache: { cacheDirectory: path.resolve(rootDir, 'cache/rsbuild') },
    },
    dev: {
      lazyCompilation: false,
    },
    server: {
      port,
      // The SSR server takes the next port, so never move to another one
      strictPort: true,
      htmlFallback: false,
      proxy: [
        {
          target: `http://localhost:${serverPort}`,
          pathFilter: (requestPath: string) => !isDevServerPath(requestPath),
        },
      ],
    },
  } satisfies RsbuildConfig;
});

function isDevServerPath(requestPath: string) {
  return (
    requestPath.startsWith('/static/') ||
    requestPath.startsWith('/rsbuild-') ||
    requestPath.startsWith('/__open-in-editor') ||
    requestPath.includes('.hot-update.')
  );
}
