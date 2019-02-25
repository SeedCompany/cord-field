// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.beta.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  debug: {
    level: 'debug',
  },
  services: {
    'domain': 'field',
    'plo.cord.bible': 'https://sqa-api.cordfield.com/api',
  },
  googleAnalytics: 'UA-108415468-9',
};
