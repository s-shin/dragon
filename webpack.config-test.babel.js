/* eslint-disable import/no-extraneous-dependencies */
import nodeExternals from 'webpack-node-externals';
import baseConfig from './webpack.config.babel';

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: baseConfig.module.rules,
  },
  plugins: baseConfig.plugins,
  resolve: baseConfig.resolve,
  devtool: 'cheap-module-source-map',
};
