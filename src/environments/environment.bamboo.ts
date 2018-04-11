export const environment = {
  production: false,
  debug: {
    level: 'debug',
    apiCalls: '*',
    noBody: [
      '/api/auth/native/login',
      '/api/sisense/sql'
    ]
  },
  services: {
    'domain': 'field',
    'profile.illuminations.bible': 'http://ilb-profile-service:8001/api',
    'plo.cord.bible': 'http://cord-api-plo:8001/api'
  },
  trace: 'bamboo environment'
};
