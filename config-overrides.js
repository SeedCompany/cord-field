/* eslint-disable @typescript-eslint/no-var-requires */
const {
  addBundleVisualizer,
  fixBabelImports,
  override,
} = require('customize-cra');

module.exports = override(
  fixBabelImports('lodash', {
    libraryDirectory: '',
    camel2DashComponentName: false,
  }),
  addBundleVisualizer({}, true)
);
