module.exports = {
  schema: 'schema.graphql',
  documents: ['./src/**/*.graphql'],
  overwrite: true,
  hooks: {
    afterOneFileWrite: ['eslint --fix'],
  },
  generates: {
    './src/api/graphql.generated.tsx': {
      plugins: [
        // Until hooks & common can be merged into one import
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
