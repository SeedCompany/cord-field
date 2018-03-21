// This is _ONLY_ used to provide WebStorm with tilde path resolution, i.e., @import '~styles';
// https://youtrack.jetbrains.com/issue/WEB-30041

module.exports = {
  resolve: {
    alias: {
      styles: __dirname + '/src/styles',
    },
  },
};
