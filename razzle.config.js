const LoadablePlugin = require('@loadable/webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const path = require('path');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const DynamicPublicPathPlugin = require('webpack-dynamic-public-path');

const modifyWebpackOptions = ({
  options: { webpackOptions: options },
  env,
}) => {
  // Exclude .cjs files from FileLoader. They should be loaded like other js files.
  options.fileLoaderExclude.push(/\.cjs$/);

  // Move cache out of node_modules
  options.terserPluginOptions = {
    ...options.terserPluginOptions,
    cache: path.resolve(__dirname, 'cache/terser-webpack-plugin'),
  };

  // Run these through babel, since the current loader doesn't understand the newer syntax.
  options.babelRule.include.push(
    require.resolve('@seedcompany/common').replace('.cjs', '.js'),
    require.resolve('@editorjs/editorjs').replace('.umd.js', '.mjs'),
    // Match both linker layouts: PnP archive paths contain `/@mui-…zip/`,
    // while the node-modules linker lays them out under `/@mui/`.
    (path) =>
      /[/\\]@mui[-/]/.test(path) ||
      path.includes('reactflow') ||
      path.includes('dagrejs')
  );

  return options;
};

const modifyWebpackConfig = (opts) => {
  /** @type {webpack.Configuration} */
  const config = opts.webpackConfig;
  const { target } = opts.env;
  const isClient = target === 'web';
  const isServer = target === 'node';

  config.resolve.plugins.push(new TsconfigPathsPlugin());

  config.resolve.alias['@seedcompany/common'] = '@seedcompany/common/index.js';

  const define = (key, value) => {
    opts.options.webpackOptions.definePluginOptions[key] = value;
  };

  if (isClient) {
    // Any references to process.env forward to window.env which our
    // SSR html provides based on app env config.
    define('process.env', 'window.env');
  }

  define(
    'process.env.MUI_X_LICENSE_KEY',
    JSON.stringify(process.env.MUI_X_LICENSE_KEY)
  );

  if (isClient) {
    const filename = path.resolve(__dirname, 'build');
    config.plugins.push(
      new LoadablePlugin({
        outputAsset: false,
        writeToDisk: { filename },
      })
    );
  } else {
    define(
      'process.env.LOADABLE_STATS_MANIFEST',
      opts.env.dev
        ? `require('path').resolve('build/loadable-stats.json')`
        : `__dirname + '/loadable-stats.json'`
    );
  }

  // Dev is Vite's now (`vite/plugins/devSsr.ts`): one process on one port,
  // with Express mounted inside Vite's connect stack. So the two-port dance
  // that used to live here — `SERVER_PORT = PORT + 1`, webpack-dev-server on
  // `PORT` with a catch-all proxy to Express, and the monkey-patch on
  // `http-proxy-middleware`'s logger to hide the resulting confusing startup
  // line — is gone, along with the `SERVER_PORT` -> `PORT` define that the
  // production server no longer needs. `razzle build` is all this config is
  // still for; stage 4 deletes it outright.

  // Change public path to be dynamic based on PUBLIC_URL env
  if (!opts.env.dev && isClient) {
    // Plugin does a string replace matching the public path, so make sure
    // no other hardcoded strings are matched by using this unique string.
    config.output.publicPath = '__PUBLIC_PATH_TO_BE_REPLACED_BY_PLUGIN_BELOW__';
    config.plugins.push(
      new DynamicPublicPathPlugin({
        externalPublicPath: 'window.env.PUBLIC_URL',
      })
    );
  }

  if (isClient && process.argv.includes('--analyze')) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'report.html',
      })
    );
  }

  // Fails if main file is too big. However it seems to be taking the unzipped sizes.
  // Plus we don't want to fail the build right now.
  config.performance = {
    hints: false,
  };

  // Run circular dependency checks on build
  // Webpack doesn't always get the initializing order of these right when
  // compiling to a single file for the server.
  if (!opts.env.dev && isServer) {
    const filesPath = path
      .normalize('src/components/files')
      // win32 black-slashes need to be escaped for regex input
      .replace(/\\/g, '\\\\');
    config.plugins.push(
      new CircularDependencyPlugin({
        exclude: RegExp(`(node_modules|${filesPath})`),
        failOnError: true,
      })
    );
  }

  if (!opts.env.dev) {
    // https://github.com/apollographql/apollo-client/blob/main/CHANGELOG.md#apollo-client-340
    // https://github.com/apollographql/apollo-client/pull/8347
    define('__DEV__', 'false');
  }

  return config;
};

/**
 * @see import('razzle/config/createConfigAsync')
 */
module.exports = {
  plugins: [],
  options: {
    enableReactRefresh: true,
    forceRuntimeEnvVars: ['HOST', 'PORT', 'PUBLIC_URL', 'RAZZLE_API_BASE_URL'],
  },
  modifyWebpackOptions,
  modifyWebpackConfig,
};

// Disable "are you sure?" check for build command
process.env.RAZZLE_NONINTERACTIVE = 'true';
