export const environment = {
  production: true,
  debug: {
    level: 'info',
    apiCalls: '*',
    noBody: [
      '/api/auth/native/login'
    ]
  },
  services: {
    'domain': 'field',
    'profile.illuminations.bible': 'https://cord-profile-sqa.ci.olivetech.com/api',
    'plo.cord.bible': 'https://cord-plo-sqa.ci.olivetech.com/api'
  }
};
