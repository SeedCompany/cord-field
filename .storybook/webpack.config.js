module.exports = ({ config }) => {
  config.resolve.modules = config.resolve.modules.filter((m) => m !== '.');
  config.module.rules = config.module.rules.filter((rule) => {
    return !(
      rule.use &&
      rule.use[0].loader &&
      rule.use[0].loader.includes('eslint-loader')
    );
  });
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [['react-app', { flow: false, typescript: true }]],
        },
      },
      require.resolve('react-docgen-typescript-loader'),
    ],
  });
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
