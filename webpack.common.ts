const path = require('path');
import {Configuration} from 'webpack';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config: Configuration = {
  mode: 'development',
  entry: './src/index.tsx',

  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    hashDigestLength: 8,
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/public/index.html',
    }),
    new MiniCssExtractPlugin(),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {loader: 'tsx', target: 'esnext'},
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext][query]',
        },
      },
      {
        test: /.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        react: {
          name: 'vendor',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/,
        },
      },
    },
  },
};

export default config;
