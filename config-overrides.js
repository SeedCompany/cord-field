/* eslint-disable @typescript-eslint/no-var-requires,react-hooks/rules-of-hooks */
const {
  useBabelRc,
  addBundleVisualizer,
  fixBabelImports,
  override,
} = require('customize-cra');

module.exports = override(
  useBabelRc(),
  (config) => {
    // disable eslint
    config.plugins = config.plugins.filter(
      (plugin) => plugin.constructor.name !== 'ESLintWebpackPlugin'
    );
    return config;
  },
  fixBabelImports('lodash', {
    libraryDirectory: '',
    camel2DashComponentName: false,
  }),
  addBundleVisualizer({}, true)
);
