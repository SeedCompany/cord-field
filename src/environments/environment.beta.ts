export const environment = {
  production: true,
  debug: {
    level: 'info',
    apiCalls: '*',
    noBody: [
      '/api/auth/native/login',
    ],
  },
  services: {
    'domain': 'field',
    'plo.cord.bible': 'https://api-beta.cordfield.com/api',
  },
};
