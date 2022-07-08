require('razzle/config/env').setupEnvironment({
  dotenv: __dirname + '/../../../../.env',
});

// https://github.com/dotansimha/graphql-code-generator/issues/7239
process.env.NODE_NO_WARNINGS = '1';
