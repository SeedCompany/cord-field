// Loads .env* files into process.env, in the same order and with the same
// precedence as razzle/config/env.js's setupEnvironment. CJS because the
// codegen hook is loaded via `ts-node -r`, and vite.config.ts needs it too.
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand'); // v5 API: expand(config)

const root = path.resolve(__dirname, '..');
// Razzle threw when NODE_ENV was unset because it always set it first; default
// instead, so a bare `yarn gql-gen` works locally.
const NODE_ENV = process.env.NODE_ENV || 'development';

// dotenv never overwrites an already-set var, so earlier files win.
const files = [
  `.env.${NODE_ENV}.local`,
  `.env.${NODE_ENV}`,
  NODE_ENV !== 'test' && '.env.local',
  '.env',
].filter(Boolean);

for (const file of files) {
  const p = path.join(root, file);
  if (fs.existsSync(p)) dotenvExpand(dotenv.config({ path: p }));
}
