/* eslint-disable @typescript-eslint/no-var-requires */
const LoadablePlugin = require('@loadable/webpack-plugin');
const _ = require('lodash');
const path = require('path');
const { DefinePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const MyPlugin = (config, { target, dev }) => {
  const isClient = target === 'web';
  const isServer = target === 'node';

  // Limit bundled env vars so that they can be changed at runtime
  // This allows a single build to be used for multiple deployments
  const envVarsToBundle = isClient
    ? ['NODE_ENV']
    : ['NODE_ENV', 'RAZZLE_ASSETS_MANIFEST', 'RAZZLE_PUBLIC_DIR'];
  replaceItemWith(
    config.plugins,
    (plugin) => plugin instanceof DefinePlugin,
    ({ definitions }) => {
      const limited = _.pick(
        definitions,
        envVarsToBundle.map((e) => `process.env.${e}`)
      );
      // For the web, defer all non-bundled vars to window.env which will be
      // given by server at runtime
      if (isClient) {
        limited['process.env'] = 'window.env';
      }
      return new DefinePlugin(limited);
    }
  );

  if (isClient) {
    config.plugins.push(
      new LoadablePlugin({
        filename: 'loadable-stats.json',
        writeToDisk: true,
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

  // Parse TS via Babel
  config.resolve.extensions.push('.ts', '.tsx');
  config.module.rules.unshift({
    test: /\.tsx?$/,
    include: path.resolve(__dirname, 'src'),
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: true,
        },
      },
    ],
  });

  return config;
};

const replaceItemWith = (list, predicate, replacement) => {
  const idx = list.findIndex(predicate);
  if (idx > -1) {
    list[idx] = replacement(list[idx]);
  }
};

module.exports = {
  plugins: [MyPlugin],
};
