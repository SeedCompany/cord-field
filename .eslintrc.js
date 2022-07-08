// @ts-check
const fs = require('fs');

const roots = fs
  .readdirSync('./src')
  .flatMap((item) => (fs.statSync(`./src/${item}`).isDirectory() ? item : []));

const restrictedImports = {
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
    ...['@material-ui/core', '@material-ui/icons', 'lodash'].map((item) => ({
      group: [`${item}/*`],
      message: `\nImport from '${item}' instead. Leave code splitting to webpack.\n`,
    })),
  ],
};

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  plugins: ['@seedcompany'],
  extends: ['plugin:@seedcompany/react'],
  rules: {
    'no-restricted-imports': ['error', restrictedImports],

    // TODO This needs to be turned on and errors fixed
    '@typescript-eslint/restrict-template-expressions': 'off',
  },
  overrides: [
    ...roots.map((root) => {
      /** @type {import('eslint').Linter.ConfigOverride} */
      const override = {
        files: [`./src/${root}/**/*`],
        rules: {
          'no-restricted-imports': [
            'error',
            {
              ...restrictedImports,
              patterns: [
                ...restrictedImports.patterns,
                {
                  group: [`~/${root}`],
                  message:
                    '\nUse a relative import instead for imports within your sub-folder\n',
                },
              ],
            },
          ],
        },
      };
      return override;
    }),

    // Toolchain is still commonjs
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ],
};

module.exports = config;
