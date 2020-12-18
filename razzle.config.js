/* eslint-disable @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports */
const LoadablePlugin = require('@loadable/webpack-plugin');
const _ = require('lodash');
const path = require('path');
const { DefinePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const modifyWebpackConfig = (opts) => {
  const config = opts.webpackConfig;
  const { target } = opts.env;
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
    const filename = path.resolve(__dirname, 'build');
    config.plugins.push(
      new LoadablePlugin({
        outputAsset: false,
        writeToDisk: { filename },
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

  return config;
};

const replaceItemWith = (list, predicate, replacement) => {
  const idx = list.findIndex(predicate);
  if (idx > -1) {
    list[idx] = replacement(list[idx]);
  }
};

module.exports = {
  plugins: [],
  experimental: {
    reactRefresh: true,
  },
  modifyWebpackConfig,
};
