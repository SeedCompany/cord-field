// We can't require webpack-cli because of https://github.com/angular/angular-cli/issues/11205
// So build here and skip the showing the output.
import * as webpack from 'webpack';

const options = require('../webpack.server.config.js');
webpack(options, (err, stats) => {
  if (err || stats.hasErrors()) {
    process.exit(1);
  }
});
