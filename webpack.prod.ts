import {Configuration} from 'webpack';
import {merge} from 'webpack-merge';
import common from './webpack.common';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {ESBuildMinifyPlugin} = require('esbuild-loader');

const config: Configuration = merge(common, {
  mode: 'production',

  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015',
      }),
      new CssMinimizerPlugin(),
    ],
  },
});

export default config;
