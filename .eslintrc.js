// @ts-check
const fs = require('fs');

const roots = fs
  .readdirSync('./src')
  .flatMap((item) => (fs.statSync(`./src/${item}`).isDirectory() ? item : []));

/** @type import('@seedcompany/eslint-plugin/dist/rules/no-restricted-imports').ImportRestriction[] */
const restrictedImports = [
  {
    path: 'react',
    importNames: 'default',
    message: [
      'Import specific things instead.',
      'Also the global import is no longer necessary for JSX compilation.',
    ].join('\n'),
  },
  {
    path: 'react',
    importNames: ['FC', 'FunctionalComponent'],
    message: [
      'This is deprecated as is the implicit children prop.',
      'Declare type for props explicitly on the first argument instead.',
      'We also have a ChildrenProp type shortcut.',
    ].join('\n'),
  },

  // As noted in https://github.com/mui-org/material-ui/releases/tag/v4.5.1
  {
    path: '@material-ui/styles',
    message: "Use '@material-ui/core' instead",
  },
  // Enforce SVG Icons as recommended
  {
    path: '@material-ui/core',
    importNames: 'Icon',
    message: "Use specific SVG Icons from '@material-ui/icons' instead",
  },
  // Enforce our Link component
  {
    path: ['@material-ui/core', 'react-router-dom'],
    importNames: ['Link', 'LinkProps'],
    message:
      'Use Link in components/Routing instead which has routing integrated',
  },
  {
    path: 'react-router',
    replacement: { path: 'react-router-dom' },
    message: "Import from 'react-router-dom' instead",
  },
  {
    pattern: ['lodash/*', 'lodash.*'],
    message: [
      `Import from library root instead.`,
      `Also don't use lodash/fp - it's not worth the bundle size.`,
      `Leave code splitting to toolchain.`,
    ].join('\n'),
    replacement: ({ importName, localName }) => ({
      path: 'lodash',
      importName: importName === 'default' ? localName : importName,
    }),
  },
  {
    pattern: [
      '@material-ui/core/*',
      '@material-ui/icons/*',
      '@material-ui/lab/*',
    ],
    message: `Import from library root instead. Leave code splitting to toolchain.`,
    replacement: ({ path, localName }) => ({
      // Chop off sub-folder
      path: path.split('/').slice(0, 2).join('/'),
      // MUI Docs use default export from folder, this allows them to be
      // copy/pasted and autocorrected to our style.
      // Icons imports are suffixed with Icon, so strip that first.
      // NOTE: This isn't sound. We are guessing that the local identifier is
      // the same name as in root export. Better to attempt and fail, as we'll
      // have an error either way.
      importName: localName.endsWith('Icon')
        ? localName.slice(0, -4)
        : localName,
    }),
  },
];

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  plugins: ['@seedcompany'],
  extends: ['plugin:@seedcompany/react'],
  rules: {
    // TODO Remove and fix
    // Allow `extends any` for TSX
    // This makes the distinction that it's a generic instead of JSX
    '@typescript-eslint/no-unnecessary-type-constraint': 'off',

    '@seedcompany/no-restricted-imports': ['error', ...restrictedImports],

    // TODO This needs to be turned on and errors fixed
    '@typescript-eslint/restrict-template-expressions': 'off',
  },
  overrides: [
    ...roots.map((root) => {
      /** @type {import('eslint').Linter.ConfigOverride} */
      const override = {
        files: [`./src/${root}/**/*`],
        rules: {
          '@seedcompany/no-restricted-imports': [
            'error',
            ...restrictedImports,
            {
              pattern: `~/${root}/*`,
              message:
                'Use a relative import instead for imports within your sub-folder',
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
