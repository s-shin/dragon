/* eslint-disable import/no-extraneous-dependencies */
import webpackConfig from './webpack.config.babel';

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'test/**/*_test.js',
    ],
    exclude: [],
    preprocessors: {
      'test/**/*_test.js': ['webpack'],
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
      plugins: webpackConfig.plugins,
    },
    webpackMiddleware: {
      stats: 'errors-only',
      noInfo: true,
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [],
    singleRun: false,
    concurrency: Infinity,
  });
};
