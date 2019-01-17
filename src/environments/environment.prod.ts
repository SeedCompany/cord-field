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
    'plo.cord.bible': 'https://api.cordfield.com/api',
  },
  googleAnalytics: 'UA-108415468-9',
};
