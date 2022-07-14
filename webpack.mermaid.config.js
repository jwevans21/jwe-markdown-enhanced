/* eslint-disable @typescript-eslint/naming-convention */
// From https://github.com/mermaidjs/mermaid-webpack-demo/

const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
   target: 'web',
   entry: {
      mermaid: path.join(__dirname, 'node_modules/mermaid/dist/mermaid.min.js'),
   },
   externals: 'fs', // in order to make mermaid work
   output: {
      path: path.join(__dirname, 'media'),
      filename: '[name].bundle.js',
   },
   module: {
      rules: [
         {
            parser: {
               amd: false,
            },
            include: /node_modules\/lodash\//, // https://github.com/lodash/lodash/issues/3052
         },
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
               loader: 'babel-loader',
            },
         },
         {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
         },
      ],
   },
   plugins: [
      new MiniCssExtractPlugin({
         // Options similar to the same options in webpackOptions.output
         // both options are optional
         filename: '[name].css',
         chunkFilename: '[id].css',
      }),
   ],
   optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
   },
};

module.exports = [config];