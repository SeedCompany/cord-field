/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const dotEnv = require('dotenv');
const dotEnvExpand = require('dotenv-expand');
const fs = require('fs');

const NODE_ENV = process.env.NODE_ENV;

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
/** @type {string[]} */
const dotenvFiles = [
  `.env.${NODE_ENV}.local`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `.env.local`,
  `.env.${NODE_ENV}`,
  '.env',
].filter(Boolean);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
for (const dotenvFile of dotenvFiles) {
  if (fs.existsSync(dotenvFile)) {
    dotEnvExpand(
      dotEnv.config({
        path: dotenvFile,
      })
    );
  }
}

// https://github.com/dotansimha/graphql-code-generator/issues/7239
process.env.NODE_NO_WARNINGS = '1';
