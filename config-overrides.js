/* eslint-disable @typescript-eslint/no-var-requires,react-hooks/rules-of-hooks */
const {
  useBabelRc,
  addBundleVisualizer,
  fixBabelImports,
  override,
} = require('customize-cra');

module.exports = override(
  useBabelRc(),
  fixBabelImports('lodash', {
    libraryDirectory: '',
    camel2DashComponentName: false,
  }),
  addBundleVisualizer({}, true)
);
