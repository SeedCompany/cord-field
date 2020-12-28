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

  // define server port to listen on that may be different than the actual exposed port
  const port = process.env.PORT ?? 3000;
  process.env.SERVER_PORT = port;
  if (opts.env.dev) {
    // WHAT: Configure webpack dev server to listen on exposed port and proxy to
    // server port that's incremented by 1.
    // WHY: This prevents cross-origin errors since the browser only uses a single port.
    // NOTE: This configuration differs from examples by flipping the
    // configured port and the proxied port, since I think it's confusing, for
    // example, to set your port to 1234 but have to access in browser at 1235.
    process.env.SERVER_PORT++;
    config.output.publicPath = `http://localhost:${port}/`;
    if (isClient) {
      config.devServer.port = port;
      config.devServer.proxy = {
        context: () => true,
        target: `http://localhost:${process.env.SERVER_PORT}`,
      };
      config.devServer.index = '';

      // Ignore proxy created log message on start to reduce clutter & prevent
      // confusion with ports.
      const proxyLogger = require('http-proxy-middleware/lib/logger').getInstance();
      const origInfo = proxyLogger.info;
      proxyLogger.info = function (...args) {
        if (
          typeof args[0] === 'string' &&
          args[0].startsWith('[HPM] Proxy created:')
        ) {
          proxyLogger.debug(...args);
        } else {
          origInfo.call(proxyLogger, ...args);
        }
      };
    }
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
