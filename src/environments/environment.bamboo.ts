export const environment = {
  production: false,
  debug: {
    level: 'debug',
    apiCalls: '*',
    noBody: [
      '/api/auth/native/login'
    ]
  },
  services: {
    'domain': 'field',
    'plo.cord.bible': 'http://cord-api-plo:8001/api'
  },
  trace: 'bamboo environment'
};
