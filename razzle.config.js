/* eslint-disable @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports */
const LoadablePlugin = require('@loadable/webpack-plugin');
const _ = require('lodash');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const modifyWebpackConfig = (opts) => {
  const config = opts.webpackConfig;
  const { target } = opts.env;
  const isClient = target === 'web';
  const isServer = target === 'node';

  const define = (key, value) => {
    opts.options.webpackOptions.definePluginOptions[key] = value;
  };

  if (isClient) {
    // Any references to process.env forward to window.env which our
    // SSR html provides based on app env config.
    define('process.env', 'window.env');
  }

  if (isClient) {
    const filename = path.resolve(__dirname, 'build');
    config.plugins.push(
      new LoadablePlugin({
        outputAsset: false,
        writeToDisk: { filename },
      })
    );
  } else {
    define('process.env.LOADABLE_STATS_MANIFEST', opts.env.dev
      ? `require('path').resolve('build/loadable-stats.json')`
      : `__dirname + '/loadable-stats.json'`);
  }

  // define server port to listen on that may be different than the actual exposed port
  const port = process.env.PORT || 3000;
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
  } else if (isServer) {
    // convert SERVER_PORT usage to just PORT since only a single port is used
    define('process.env.SERVER_PORT', 'process.env.PORT');
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

  // Exclude .cjs files from FileLoader. They should be loaded like other js files.
  config.module.rules[1].exclude.push(/\.cjs$/);

  return config;
};

module.exports = {
  plugins: [],
  options: {
    enableReactRefresh: true,
    forceRuntimeEnvVars: ['HOST', 'PORT', 'PUBLIC_URL', 'RAZZLE_API_BASE_URL'],
  },
  modifyWebpackConfig,
};
