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
    'profile.illuminations.bible': 'http://ilb-profile-service:8001/api'
  },
  trace: 'bamboo environment'
};
