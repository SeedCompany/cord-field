const fs = require('node:fs');
const path = require('node:path');

/**
 * Loads `.env*` files into `process.env`, using the same order as Razzle.
 *
 * The first file to set a key wins, and real env vars always beat file values.
 *
 * @example
 * ```js
 * loadEnvFiles('production');
 * // reads .env.production.local, .env.production, .env.local, .env
 * ```
 */
function loadEnvFiles(nodeEnv, rootDir = path.resolve(__dirname, '..')) {
  const envFileNames = [
    `.env.${nodeEnv}.local`,
    `.env.${nodeEnv}`,
    nodeEnv !== 'test' && '.env.local',
    '.env',
  ].filter(Boolean);
  for (const envFileName of envFileNames) {
    const envFilePath = path.join(rootDir, envFileName);
    if (fs.existsSync(envFilePath)) {
      process.loadEnvFile(envFilePath);
    }
  }
}

module.exports = { loadEnvFiles };
