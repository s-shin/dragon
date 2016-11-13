/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const isHot = Boolean(process.env.HOT);
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  target: 'electron',
  entry: {
    main: ['babel-polyfill', './main.js'],
    app: ['babel-polyfill', './app/index.js'],
    ...(!isHot ? {} : { style: './assets/scss/index.js' }),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: `http://localhost:${process.env.PORT || 8080}/dist/`,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue',
        options: {},
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ],
      },
      {
        test: /\.scss$/,
        loader: isHot
          ? 'style!css!postcss!sass'
          : ExtractTextPlugin.extract({ loader: ['postcss-loader', 'sass-loader'] }),
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.yml$/,
        loader: 'json!yaml',
      },
    ],
  },
  plugins: [
    new webpack.IgnorePlugin(/regenerator|nodent|js\-beautify/, /ajv/),
    ...(isHot ? [] : [
      new ExtractTextPlugin('./dist/style.css'),
    ]),
    ...(!isProduction ? [] : [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
        },
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
    ]),
  ],
  resolve: {
    alias: {
      vue$: 'vue/dist/vue',
    },
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
  },
  devtool: isProduction ? '#source-map' : '#eval-source-map',
};

module.exports = config;
