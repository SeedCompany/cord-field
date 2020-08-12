/* eslint-disable @typescript-eslint/no-var-requires,react-hooks/rules-of-hooks */
const {
  useBabelRc,
  addBundleVisualizer,
  disableEsLint,
  fixBabelImports,
  override,
} = require('customize-cra');

module.exports = override(
  useBabelRc(),
  disableEsLint(),
  fixBabelImports('lodash', {
    libraryDirectory: '',
    camel2DashComponentName: false,
  }),
  addBundleVisualizer({}, true)
);
