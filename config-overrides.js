/* eslint-disable @typescript-eslint/no-var-requires */
const { addBundleVisualizer, override } = require('customize-cra');

module.exports = override(
  addBundleVisualizer({}, true)
  // more
);
