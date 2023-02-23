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

  // Enforce SVG Icons as recommended
  {
    path: '@mui/material',
    importNames: 'Icon',
    message: "Use specific SVG Icons from '@mui/icons-material' instead",
  },
  // Enforce our Link component
  {
    path: ['@mui/material', 'react-router-dom'],
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
    importNames: 'default',
    path: 'lodash',
    message: 'Import functions directly to enable tree-shaking at build time',
  },

  // Import css & keyframes straight from emotion (not any re-export from other libs)
  // This ensures their babel plugin works correctly.
  {
    path: ['tss-react', '@mui/system', '@mui/material', '@mui/material/styles'],
    importNames: ['css', 'keyframes'],
    replacement: { path: '@emotion/react' },
    message: "Import from '@emotion/react' instead",
  },

  // Our babel import transforms don't work with these exports
  {
    path: '@mui/material',
    importNames: ['styled', 'useTheme'],
    replacement: { path: '@mui/material/styles' },
    message: "Import from '@mui/material/styles' instead",
  },

  // Hide emotion as much as possible
  {
    pattern: '@emotion/react',
    allowNames: ['CacheProvider', 'EmotionCache', 'css', 'keyframes'],
    message: "Import from '@mui/material/styles' instead",
    replacement: { path: '@mui/material/styles' },
  },
  {
    pattern: '@emotion/styled',
    importNames: 'default',
    message: "Import from '@mui/material/styles' instead",
    replacement: {
      path: '@mui/material/styles',
      importName: 'styled',
    },
  },

  // @mui/system is low-level, use @mui/material instead
  // Which wraps to provide more functionality
  {
    path: '@mui/system/styled',
    importNames: 'default',
    message: "Import from '@mui/material/styles' instead",
    replacement: {
      path: '@mui/material/styles',
      importName: 'styled',
    },
  },
  {
    path: '@mui/system',
    importNames: 'Box',
    message: "Import from '@mui/material' instead",
    replacement: {
      path: '@mui/material',
    },
  },
  {
    path: ['@mui/system/Box', '@mui/material/Box', '@mui/system/Box/Box'],
    importNames: 'default',
    message: "Import from '@mui/material' instead",
    replacement: {
      path: '@mui/material',
      importName: 'Box',
    },
  },
  {
    path: '@mui/system',
    message: `Import from '@mui/material/styles' instead.`,
    replacement: {
      path: '@mui/material/styles',
    },
  },

  // So many things in lab have been moved, but they stubbed or aliased exports
  // for a smoother transition. Ensure correct & _working_ imports are used.
  {
    path: '@mui/lab',
    importNames: [
      'Alert',
      'AlertColor',
      'AlertProps',
      'AlertTitle',
      'AlertTitleProps',
      'Autocomplete',
      'AutocompleteChangeDetails',
      'AutocompleteChangeReason',
      'AutocompleteCloseReason',
      'AutocompleteInputChangeReason',
      'AutocompleteOwnerState',
      'AutocompleteProps',
      'AutocompleteRenderGetTagProps',
      'AutocompleteRenderGroupParams',
      'AutocompleteRenderInputParams',
      'AutocompleteRenderOptionState',
      'AvatarGroup',
      'AvatarGroupProps',
      'Pagination',
      'PaginationProps',
      'PaginationRenderItemParams',
      'PaginationItem',
      'PaginationItemProps',
      'PaginationItemTypeMap',
      'Rating',
      'RatingProps',
      'IconContainerProps',
      'Skeleton',
      'SkeletonProps',
      'SkeletonTypeMap',
      'SpeedDial',
      'SpeedDialProps',
      'CloseReason',
      'OpenReason',
      'SpeedDialAction',
      'SpeedDialActionProps',
      'SpeedDialIcon',
      'SpeedDialIconProps',
      'ToggleButton',
      'ToggleButtonProps',
      'ToggleButtonTypeMap',
      'ToggleButtonGroup',
      'ToggleButtonGroupProps',
    ],
    message: 'Component was moved out of `@mui/lab` to `@mui/material`',
    replacement: { path: '@mui/material' },
  },
  {
    path: '@mui/lab',
    importNames: [
      'AdapterDateFns',
      'AdapterDayjs',
      'AdapterLuxon',
      'AdapterMoment',
      'CalendarPicker',
      'CalendarPickerSkeleton',
      'ClockPicker',
      'DatePicker',
      'DateTimePicker',
      'DesktopDatePicker',
      'DesktopDateTimePicker',
      'DesktopTimePicker',
      'LocalizationProvider',
      'MobileDatePicker',
      'MobileDateTimePicker',
      'MobileTimePicker',
      'MonthlyPicker',
      'PickersDay',
      'StaticDatePicker',
      'StaticDateTimePicker',
      'StaticTimePicker',
      'TimePicker',
      'YearPicker',
    ],
    message: 'Component was moved from `@mui/lab` to `@mui/x-date-pickers`',
    replacement: {
      path: '@mui/x-date-pickers',
    },
  },
  {
    path: '@mui/lab',
    importNames: [
      'DateRangePicker',
      'DateRangePickerDay',
      'DesktopDateRangePicker',
      'MobileDateRangePicker',
      'StaticDateRangePicker',
    ],
    message: [
      'Component was moved from `@mui/lab` to `@mui/x-date-pickers-pro`',
      '',
      'More information about this migration on our blog: https://mui.com/x/react-date-pickers/migration-lab/.',
    ].join('\n'),
    replacement: {
      path: '@mui/x-date-pickers-pro',
    },
  },

  // Fake export, ensure correct & working function is used.
  {
    path: ['@mui/material', '@mui/material/styles'],
    importNames: ['makeStyles', 'withStyles'],
    replacement: { path: 'tss-react/mui' },
  },
  {
    path: '@mui/material/styles/makeStyles',
    importNames: 'default',
    replacement: { path: 'tss-react/mui', importName: 'makeStyles' },
  },

  {
    path: [
      '@mui/system',
      '@mui/material',
      '@mui/lab',
      '@mui/icons-material',
      '@mui/x-date-pickers',
      '@mui/x-date-pickers-pro',
    ],
    importNames: 'default',
    kind: 'value',
    message: 'Import specific things instead to allow tree shaking',
  },
  {
    pattern: [
      '@mui/material/*',
      '!@mui/material/styles',
      '!@mui/material/colors',
      '!@mui/material/transitions',
      '!@mui/material/utils',
      '@mui/icons-material/*',
      '@mui/lab/*',
      '@mui/system/*',
      '@mui/x-date-pickers/*',
      '@mui/x-date-pickers-pro/*',
      '!themeAugmentation',
      '!Unstable_Grid2',
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
  plugins: ['@seedcompany', 'tss-unused-classes'],
  extends: ['plugin:@seedcompany/react'],
  rules: {
    'tss-unused-classes/unused-classes': 'warn',

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
