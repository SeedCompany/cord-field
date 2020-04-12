require('dotenv').config({
  path: `.env`,
});

module.exports = {
  schema: [
    {
      [`${process.env.REACT_APP_API_BASE_URL}/graphql`]: {
        headers: {},
      },
    },
  ],
  documents: ['./src/**/*.graphql'],
  overwrite: true,
  hooks: {
    afterOneFileWrite: ['eslint --fix'],
  },
  generates: {
    './src/generated/graphql.tsx': {
      plugins: [
        { add: '/* eslint-disable import/no-duplicates */' },
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        scalars: {
          Date: 'string',
          DateTime: 'string',
        },
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: true,
        enumsAsTypes: true,
        apolloReactHooksImportFrom: '@apollo/client',
        apolloReactCommonImportFrom: '@apollo/client',
      },
    },
  },
};
