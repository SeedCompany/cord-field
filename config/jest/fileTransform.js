const path = require('node:path');

// Asset imports resolve to their file name in tests
module.exports = {
  process(src, filename) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(filename))};`,
    };
  },
};
