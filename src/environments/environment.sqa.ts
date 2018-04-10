// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  debug: {
    level: 'debug',
    apiCalls: '*',
    noBody: [
      '/api/auth/native/login',
      '/api/donations/history',
      '/api/sisense/sql'
    ]
  },
  services: {
    'profile.illuminations.bible': 'https://cord-profile-sqa.ci.olivetech.com/api',
    'plo.cord.bible': 'https://cord-plo-sqa.ci.olivetech.com/api',
  }
};
