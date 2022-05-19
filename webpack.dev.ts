import {Configuration as WebpackConfiguration, Configuration} from 'webpack';
import {merge} from 'webpack-merge';
import common from './webpack.common';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config: Configuration = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
      },
    },
    historyApiFallback: true,
  },
});

export default config;
