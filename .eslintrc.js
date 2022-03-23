// @ts-check

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  plugins: ['@seedcompany'],
  extends: ['plugin:@seedcompany/react'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          // As noted in https://github.com/mui-org/material-ui/releases/tag/v4.5.1
          {
            name: '@material-ui/styles',
            message: "Use '@material-ui/core' instead",
          },
          // Enforce SVG Icons as recommended
          {
            name: '@material-ui/core',
            importNames: ['Icon'],
            message: "Use specific SVG Icons from '@material-ui/icons' instead",
          },
          // Enforce our Link component
          {
            name: '@material-ui/core',
            importNames: ['Link'],
            message:
              'Use Link in components/Routing instead which has routing integrated',
          },
          {
            name: 'camel-case',
            message: 'Use camelCase from lodash instead.',
          },
          {
            name: 'is-plain-object',
            message: 'Use isPlainObject from lodash instead.',
          },
        ],
        patterns: [
          // Enforce single import. Leave code splitting to webpack.
          '@material-ui/core/*',
          '@material-ui/icons/*',
          'lodash/*',
        ],
      },
    ],

    // TODO This needs to be turned on and errors fixed
    '@typescript-eslint/restrict-template-expressions': 'off',
  },
};

module.exports = config;
