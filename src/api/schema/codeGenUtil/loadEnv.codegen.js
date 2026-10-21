require('../../../../config/loadEnvFiles.cjs').loadEnvFiles(
  process.env.NODE_ENV || 'development'
);

// https://github.com/dotansimha/graphql-code-generator/issues/7239
process.env.NODE_NO_WARNINGS = '1';
