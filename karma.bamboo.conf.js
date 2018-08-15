// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-junit-reporter'),
      require('karma-mocha-reporter')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    reporters: ['mocha', 'kjhtml', 'junit'],
    junitReporter: {
      outputDir: 'testResults/'
    },
    mochaReporter: {
      showDiff: true,
      ignoreSkipped: true
    },
    browserNoActivityTimeout: 20000,
    port: 9876,
    colors: false,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['docker'],
    customLaunchers: {
      // https://github.com/karma-runner/karma-chrome-launcher/issues/125#issuecomment-312668593
      docker: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox', // required to run without privileges in docker
          '--user-data-dir=/tmp/chrome-test-profile',
          '--disable-web-security'
        ]
      }
    },
    singleRun: true
  });
};
