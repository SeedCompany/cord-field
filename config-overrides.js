/* eslint-disable @typescript-eslint/no-var-requires */
const {
  addBundleVisualizer,
  addBabelPlugin,
  fixBabelImports,
  override,
} = require('customize-cra');

module.exports = override(
  fixBabelImports('lodash', {
    libraryDirectory: '',
    camel2DashComponentName: false,
  }),
  addBabelPlugin('mui-make-styles'),
  addBundleVisualizer({}, true)
);
